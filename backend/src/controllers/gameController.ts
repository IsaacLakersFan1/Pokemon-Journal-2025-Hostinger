import { Request, Response } from 'express';
import prisma from "../utils/prismaClient";
import { 
  excludeDeletedGame, 
  excludeDeletedPlayerGame,
  excludeDeletedPlayer,
  excludeDeletedEvent,
  softDeleteGameData, 
  updateGameData,
  restoreGameData 
} from "../utils/softDelete";

interface AuthenticatedRequest extends Request {
    user?: {
      userId: number; // The type of `userId` that you'll get from the JWT payload
    };
  }

// Create a new game
export const createGame = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { name, playerCount } = req.body;
  const userId = req.user?.userId;  // Access the userId from the JWT payload

  if (!userId) {
    res.status(400).json({ error: 'User not authenticated' });
    return;
  }

  try {
    const newGame = await prisma.game.create({
      data: {
        name,
        playerCount,
        userId,  // Associate the game with the authenticated user
      },
    });

    res.status(201).json({ message: 'Game created successfully', game: newGame });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to create game' });
  }
};

// Soft Delete a game by ID
export const deleteGame = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const gameId = parseInt(req.params.id);
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400).json({ error: 'User not authenticated' });
    return;
  }

  try {
    // Check if the game exists, is not soft-deleted, and is associated with the user
    const game = await prisma.game.findFirst({
      where: { 
        id: gameId,
        ...excludeDeletedGame(),
      },
    });

    if (!game) {
      res.status(404).json({ error: 'Game not found or already deleted' });
      return;
    }

    if (game.userId !== userId) {
      res.status(403).json({ error: 'You are not authorized to delete this game' });
      return;
    }

    // Soft delete the game
    await prisma.game.update({
      where: { id: gameId },
      data: softDeleteGameData(),
    });

    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ error: 'Failed to delete game' });
  }
};

// Restore soft-deleted game by ID
export const restoreGame = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const gameId = parseInt(req.params.id);
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400).json({ error: 'User not authenticated' });
    return;
  }

  try {
    // Check if the soft-deleted game exists and is associated with the user
    const game = await prisma.game.findFirst({
      where: { 
        id: gameId,
        deletedAt: { not: null },
      },
    });

    if (!game) {
      res.status(404).json({ error: 'Deleted game not found' });
      return;
    }

    if (game.userId !== userId) {
      res.status(403).json({ error: 'You are not authorized to restore this game' });
      return;
    }

    // Restore the game
    const restoredGame = await prisma.game.update({
      where: { id: gameId },
      data: restoreGameData(),
    });

    res.status(200).json({ 
      message: 'Game restored successfully',
      game: restoredGame,
    });
  } catch (error) {
    console.error('Error restoring game:', error);
    res.status(500).json({ error: 'Failed to restore game' });
  }
};


// Get all games for the authenticated user
export const getAllGames = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400).json({ error: 'User not authenticated' });
    return;
  }

  try {
    // Fetch all non-deleted games for the authenticated user
    const games = await prisma.game.findMany({
      where: {
        userId,
        ...excludeDeletedGame(),
      },
      include: {
        playerGames: {
          include: {
            player: true,
          },
        },
        events: true,
      },
    });

    res.status(200).json({ games });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
};

// Get a single game by ID
export const getGameById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const gameId = parseInt(req.params.id);
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400).json({ error: 'User not authenticated' });
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
      res.status(404).json({ error: 'Game not found' });
      return;
    }

    res.status(200).json({ game });
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
};

// Update game by ID
export const updateGame = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const gameId = parseInt(req.params.id);
  const userId = req.user?.userId;
  const { name, playerCount } = req.body;

  if (!userId) {
    res.status(400).json({ error: 'User not authenticated' });
    return;
  }

  try {
    // Check if the game exists, is not soft-deleted, and is associated with the user
    const game = await prisma.game.findFirst({
      where: { 
        id: gameId,
        ...excludeDeletedGame(),
      },
    });

    if (!game) {
      res.status(404).json({ error: 'Game not found or already deleted' });
      return;
    }

    if (game.userId !== userId) {
      res.status(403).json({ error: 'You are not authorized to update this game' });
      return;
    }

    // Update the game with updatedAt timestamp
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: updateGameData({ name, playerCount }),
    });

    res.status(200).json({ 
      message: 'Game updated successfully',
      game: updatedGame,
    });
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({ error: 'Failed to update game' });
  }
};
