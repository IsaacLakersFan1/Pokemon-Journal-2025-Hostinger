import { Request, Response } from "express";
import prisma from "../utils/prismaClient";
import {
  excludeDeletedGame,
  excludeDeletedEvent,
  excludeDeletedPokemon,
} from "../utils/softDelete";

interface AuthenticatedRequest extends Request {
  user?: { userId: number };
}

/**
 * Search owner's games and events only (nickname, route, pokemon, game name).
 */
export const searchOwnerContent = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";

  if (!userId) {
    res.status(400).json({ message: "No autenticado" });
    return;
  }
  if (q.length < 2) {
    res.status(200).json({ games: [], events: [] });
    return;
  }

  try {
    const games = await prisma.game.findMany({
      where: {
        userId,
        ...excludeDeletedGame(),
        OR: [
          { name: { contains: q } },
          { pokemonGame: { contains: q } },
          { notes: { contains: q } },
        ],
      },
      select: {
        id: true,
        name: true,
        pokemonGame: true,
        updatedAt: true,
      },
      take: 20,
      orderBy: { updatedAt: "desc" },
    });

    const events = await prisma.event.findMany({
      where: {
        ...excludeDeletedEvent(),
        game: { userId, ...excludeDeletedGame() },
        OR: [
          { nickname: { contains: q } },
          { route: { contains: q } },
          {
            pokemon: {
              ...excludeDeletedPokemon(),
              name: { contains: q },
            },
          },
        ],
      },
      include: {
        pokemon: { select: { id: true, name: true, image: true } },
        player: { select: { id: true, name: true } },
        game: { select: { id: true, name: true } },
      },
      take: 40,
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ games, events });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Error en la búsqueda" });
  }
};
