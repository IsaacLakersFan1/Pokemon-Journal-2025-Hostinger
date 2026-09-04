import { Request, Response } from "express";
import prisma from "../utils/prismaClient";
import {
  excludeDeletedGame,
  excludeDeletedPlayerGame,
  softDeleteGameData,
  softDeletePlayerGameData,
  softDeleteEventData,
  softDeleteShowdownData,
  updateGameData,
  restoreGameData,
} from "../utils/softDelete";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
  };
}

export const createGame = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { name, playerCount, pokemonGame, notes, routeList } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400).json({ error: "User not authenticated" });
    return;
  }

  try {
    const newGame = await prisma.game.create({
      data: {
        name,
        playerCount,
        userId,
        pokemonGame: pokemonGame || null,
        notes: notes || null,
        routeList:
          typeof routeList === "string"
            ? routeList
            : Array.isArray(routeList)
              ? JSON.stringify(routeList)
              : null,
      },
    });

    res.status(201).json({ message: "Game created successfully", game: newGame });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create game" });
  }
};

export const deleteGame = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const gameId = parseInt(req.params.id);
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400).json({ error: "User not authenticated" });
    return;
  }

  try {
    const game = await prisma.game.findFirst({
      where: {
        id: gameId,
        ...excludeDeletedGame(),
      },
    });

    if (!game) {
      res.status(404).json({ error: "Game not found or already deleted" });
      return;
    }

    if (game.userId !== userId) {
      res.status(403).json({ error: "You are not authorized to delete this game" });
      return;
    }

    const now = softDeleteGameData();
    await prisma.$transaction([
      prisma.game.update({ where: { id: gameId }, data: now }),
      prisma.playerGame.updateMany({
        where: { gameId, deletedAt: null },
        data: softDeletePlayerGameData(),
      }),
      prisma.event.updateMany({
        where: { gameId, deletedAt: null },
        data: softDeleteEventData(),
      }),
      prisma.showdown.updateMany({
        where: { gameId, deletedAt: null },
        data: softDeleteShowdownData(),
      }),
    ]);

    res.status(200).json({ message: "Game deleted successfully" });
  } catch (error) {
    console.error("Error deleting game:", error);
    res.status(500).json({ error: "Failed to delete game" });
  }
};

export const restoreGame = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const gameId = parseInt(req.params.id);
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400).json({ error: "User not authenticated" });
    return;
  }

  try {
    const game = await prisma.game.findFirst({
      where: {
        id: gameId,
        deletedAt: { not: null },
      },
    });

    if (!game) {
      res.status(404).json({ error: "Deleted game not found" });
      return;
    }

    if (game.userId !== userId) {
      res.status(403).json({ error: "You are not authorized to restore this game" });
      return;
    }

    const restoredGame = await prisma.game.update({
      where: { id: gameId },
      data: restoreGameData(),
    });

    res.status(200).json({
      message: "Game restored successfully",
      game: restoredGame,
    });
  } catch (error) {
    console.error("Error restoring game:", error);
    res.status(500).json({ error: "Failed to restore game" });
  }
};

export const getAllGames = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400).json({ error: "User not authenticated" });
    return;
  }

  try {
    const games = await prisma.game.findMany({
      where: {
        userId,
        ...excludeDeletedGame(),
      },
      include: {
        playerGames: {
          where: excludeDeletedPlayerGame(),
          include: {
            player: {
              select: { id: true, name: true },
            },
          },
        },
        _count: {
          select: {
            events: { where: { deletedAt: null } },
            showdowns: { where: { deletedAt: null } },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    res.status(200).json({ games });
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ error: "Failed to fetch games" });
  }
};

export const getGameById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const gameId = parseInt(req.params.id);
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400).json({ error: "User not authenticated" });
    return;
  }

  try {
    const game = await prisma.game.findFirst({
      where: {
        id: gameId,
        userId,
        ...excludeDeletedGame(),
      },
      include: {
        playerGames: {
          where: excludeDeletedPlayerGame(),
          include: {
            player: {
              include: {
                pokemon: {
                  select: { name: true, image: true },
                },
              },
            },
          },
        },
      },
    });

    if (!game) {
      res.status(404).json({ error: "Game not found" });
      return;
    }

    res.status(200).json({ game });
  } catch (error) {
    console.error("Error fetching game:", error);
    res.status(500).json({ error: "Failed to fetch game" });
  }
};

export const updateGame = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const gameId = parseInt(req.params.id);
  const userId = req.user?.userId;
  const { name, playerCount, pokemonGame, notes, routeList } = req.body;

  if (!userId) {
    res.status(400).json({ error: "User not authenticated" });
    return;
  }

  try {
    const game = await prisma.game.findFirst({
      where: {
        id: gameId,
        ...excludeDeletedGame(),
      },
    });

    if (!game) {
      res.status(404).json({ error: "Game not found or already deleted" });
      return;
    }

    if (game.userId !== userId) {
      res.status(403).json({ error: "You are not authorized to update this game" });
      return;
    }

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: updateGameData({
        ...(name !== undefined ? { name } : {}),
        ...(playerCount !== undefined ? { playerCount } : {}),
        ...(pokemonGame !== undefined ? { pokemonGame } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(routeList !== undefined
          ? {
              routeList:
                typeof routeList === "string"
                  ? routeList
                  : Array.isArray(routeList)
                    ? JSON.stringify(routeList)
                    : null,
            }
          : {}),
      }),
    });

    res.status(200).json({
      message: "Game updated successfully",
      game: updatedGame,
    });
  } catch (error) {
    console.error("Error updating game:", error);
    res.status(500).json({ error: "Failed to update game" });
  }
};
