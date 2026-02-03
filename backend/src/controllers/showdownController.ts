import { Request, Response } from "express";
import prisma from "../utils/prismaClient";
import {
  excludeDeletedShowdown,
  excludeDeletedEvent,
  excludeDeletedGame,
  excludeDeletedPlayerGame,
  softDeleteShowdownData,
} from "../utils/softDelete";

interface AuthenticatedRequest extends Request {
  user?: { userId: number };
}

const POINTS_PER_WIN = 10;
const POINTS_PER_DEFEATED = -1;

function parseEventIds(json: string): number[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr.map(Number).filter((n) => !isNaN(n)) : [];
  } catch {
    return [];
  }
}

async function getDefeatedCountByPlayerInGame(gameId: number): Promise<Map<number, number>> {
  const events = await prisma.event.findMany({
    where: {
      gameId,
      status: "Defeated",
      ...excludeDeletedEvent(),
      game: { deletedAt: null },
    },
    select: { playerId: true },
  });
  const map = new Map<number, number>();
  for (const e of events) {
    map.set(e.playerId, (map.get(e.playerId) ?? 0) + 1);
  }
  return map;
}

export const createShowdown = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(400).json({ error: "User not authenticated" });
    return;
  }
  const { gameId, player1Id, player2Id, winnerId, player1EventIds, player2EventIds, mvpEventId } = req.body;
  if (!gameId || !player1Id || !player2Id || !winnerId || !player1EventIds || !player2EventIds) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const p1Ids = Array.isArray(player1EventIds) ? player1EventIds : parseEventIds(player1EventIds);
  const p2Ids = Array.isArray(player2EventIds) ? player2EventIds : parseEventIds(player2EventIds);
  const validCount = (ids: number[]) => ids.length >= 1 && ids.length <= 6;
  if (!validCount(p1Ids) || !validCount(p2Ids)) {
    res.status(400).json({ error: "Each player must have between 1 and 6 event IDs" });
    return;
  }
  try {
    const game = await prisma.game.findFirst({
      where: { id: gameId, userId, ...excludeDeletedGame() },
    });
    if (!game) {
      res.status(404).json({ error: "Game not found" });
      return;
    }
    const showdown = await prisma.showdown.create({
      data: {
        gameId,
        player1Id,
        player2Id,
        winnerId,
        player1EventIds: JSON.stringify(p1Ids),
        player2EventIds: JSON.stringify(p2Ids),
        mvpEventId: mvpEventId ?? null,
      },
      include: {
        player1: true,
        player2: true,
        winner: true,
        mvpEvent: { include: { pokemon: true, player: true } },
      },
    });
    res.status(201).json({ message: "Showdown created", showdown });
  } catch (error) {
    console.error("Error creating showdown:", error);
    res.status(500).json({ error: "Failed to create showdown" });
  }
};

export const getShowdownsByGame = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const gameId = parseInt(req.params.gameId);
  if (!userId || !gameId) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  try {
    const game = await prisma.game.findFirst({
      where: { id: gameId, userId, ...excludeDeletedGame() },
      select: { id: true, name: true },
    });
    if (!game) {
      res.status(404).json({ error: "Game not found" });
      return;
    }

    const playerGames = await prisma.playerGame.findMany({
      where: { gameId, ...excludeDeletedPlayerGame() },
      include: { player: { select: { id: true, name: true } } },
    });
    const players = playerGames.map((pg) => pg.player);
    const defeatedByPlayer = await getDefeatedCountByPlayerInGame(gameId);

    const matchupKey = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);
    type MatchupEntry = {
      player1Id: number;
      player2Id: number;
      player1Name: string;
      player2Name: string;
      showdowns: Awaited<ReturnType<typeof prisma.showdown.findMany>>;
      player1Points: number;
      player2Points: number;
    };
    const matchupsMap = new Map<string, MatchupEntry>();

    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        const p1 = players[i];
        const p2 = players[j];
        const key = matchupKey(p1.id, p2.id);
        const p1Defeated = defeatedByPlayer.get(p1.id) ?? 0;
        const p2Defeated = defeatedByPlayer.get(p2.id) ?? 0;
        matchupsMap.set(key, {
          player1Id: p1.id,
          player2Id: p2.id,
          player1Name: p1.name,
          player2Name: p2.name,
          showdowns: [],
          player1Points: POINTS_PER_DEFEATED * p1Defeated,
          player2Points: POINTS_PER_DEFEATED * p2Defeated,
        });
      }
    }

    const showdowns = await prisma.showdown.findMany({
      where: { gameId, ...excludeDeletedShowdown() },
      include: {
        player1: { select: { id: true, name: true } },
        player2: { select: { id: true, name: true } },
        winner: { select: { id: true, name: true } },
        mvpEvent: {
          include: {
            pokemon: { select: { id: true, name: true, image: true } },
            player: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    for (const s of showdowns) {
      const key = matchupKey(s.player1Id, s.player2Id);
      const m = matchupsMap.get(key);
      if (!m) continue;
      m.showdowns.push(s);
      if (s.winnerId === s.player1Id) m.player1Points += POINTS_PER_WIN;
      if (s.winnerId === s.player2Id) m.player2Points += POINTS_PER_WIN;
    }

    const matchups = Array.from(matchupsMap.values());
    res.status(200).json({ gameName: game.name, matchups });
  } catch (error) {
    console.error("Error fetching showdowns:", error);
    res.status(500).json({ error: "Failed to fetch showdowns" });
  }
};

export const updateShowdown = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const showdownId = parseInt(req.params.id);
  if (!userId || !showdownId) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const { player1Id, player2Id, winnerId, player1EventIds, player2EventIds, mvpEventId } = req.body;
  try {
    const existing = await prisma.showdown.findFirst({
      where: { id: showdownId, ...excludeDeletedShowdown() },
      include: { game: true },
    });
    if (!existing || existing.game.userId !== userId) {
      res.status(404).json({ error: "Showdown not found" });
      return;
    }
    const data: Record<string, unknown> = { updatedAt: new Date() };
    if (player1Id != null) data.player1Id = player1Id;
    if (player2Id != null) data.player2Id = player2Id;
    if (winnerId != null) data.winnerId = winnerId;
    if (player1EventIds != null) data.player1EventIds = typeof player1EventIds === "string" ? player1EventIds : JSON.stringify(player1EventIds);
    if (player2EventIds != null) data.player2EventIds = typeof player2EventIds === "string" ? player2EventIds : JSON.stringify(player2EventIds);
    if (mvpEventId !== undefined) data.mvpEventId = mvpEventId;
    const updated = await prisma.showdown.update({
      where: { id: showdownId },
      data: data as never,
      include: {
        player1: true,
        player2: true,
        winner: true,
        mvpEvent: { include: { pokemon: true, player: true } },
      },
    });
    res.status(200).json({ message: "Showdown updated", showdown: updated });
  } catch (error) {
    console.error("Error updating showdown:", error);
    res.status(500).json({ error: "Failed to update showdown" });
  }
};

export const deleteShowdown = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const showdownId = parseInt(req.params.id);
  if (!userId || !showdownId) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  try {
    const existing = await prisma.showdown.findFirst({
      where: { id: showdownId, ...excludeDeletedShowdown() },
      include: { game: true },
    });
    if (!existing || existing.game.userId !== userId) {
      res.status(404).json({ error: "Showdown not found" });
      return;
    }
    await prisma.showdown.update({
      where: { id: showdownId },
      data: softDeleteShowdownData(),
    });
    res.status(200).json({ message: "Showdown deleted" });
  } catch (error) {
    console.error("Error deleting showdown:", error);
    res.status(500).json({ error: "Failed to delete showdown" });
  }
};
