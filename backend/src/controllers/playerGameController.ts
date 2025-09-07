import { Request, Response } from 'express';
import prisma from "../utils/prismaClient";
import { 
  excludeDeletedPlayerGame, 
  excludeDeletedPlayer,
  excludeDeletedGame,
  excludeDeletedPokemon,
  softDeletePlayerGameData, 
  updatePlayerGameData,
  restorePlayerGameData 
} from "../utils/softDelete";

interface AuthenticatedRequest extends Request {
    user?: {
      userId: number; // The type of `userId` that you'll get from the JWT payload
    };
  }

// Create a relation between a player and a game
export const createPlayerGame = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { playerId, gameId } = req.body;
  const userId = req.user?.userId;  // Extract userId from the authenticated user

  if (!userId) {
    res.status(400).json({ error: 'User not authenticated' });
    return;
  }

  try {
    // Check if the player and game belong to the authenticated user and are not soft-deleted
    const player = await prisma.player.findFirst({
      where: { 
        id: playerId,
        ...excludeDeletedPlayer(),
      },
    });

    const game = await prisma.game.findFirst({
      where: { 
        id: gameId,
        ...excludeDeletedGame(),
      },
    });

    if (!player || player.userId !== userId) {
      res.status(400).json({ error: 'Player not found, deleted, or does not belong to the user' });
      return;
    }

    if (!game || game.userId !== userId) {
      res.status(400).json({ error: 'Game not found, deleted, or does not belong to the user' });
      return;
    }

    // Check if the relation already exists
    const existingRelation = await prisma.playerGame.findFirst({
      where: {
        playerId,
        gameId,
        ...excludeDeletedPlayerGame(),
      },
    });

    if (existingRelation) {
      res.status(400).json({ error: 'Player is already linked to this game' });
      return;
    }

    // Create the player-game relation
    const newPlayerGame = await prisma.playerGame.create({
      data: {
        playerId,
        gameId,
      },
    });

    res.status(201).json({ message: 'Player linked to game successfully', playerGame: newPlayerGame });
  } catch (error) {
    console.error('Error linking player to game:', error);
    res.status(500).json({ error: 'Failed to link player to game' });
  }
};

// Get all players associated with a specific game
export const getPlayersInGame = async (req: Request, res: Response): Promise<void> => {
  const gameId = parseInt(req.params.gameId);

  try {
      const players = await prisma.playerGame.findMany({
          where: { 
            gameId,
            ...excludeDeletedPlayerGame(),
          },
          include: {
              player: {
                  include: {
                      pokemon: {
                          select: {
                              name: true,
                              image: true,
                          },
                      },
                  },
              },
          },
      });

      res.status(200).json({ players });
  } catch (error) {
      console.error('Error fetching players for the game:', error);
      res.status(500).json({ error: 'Failed to fetch players for the game' });
  }
};

// Remove player from game (soft delete the relation)
export const removePlayerFromGame = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { playerId, gameId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400).json({ error: 'User not authenticated' });
    return;
  }

  try {
    // Check if the player and game belong to the authenticated user
    const player = await prisma.player.findFirst({
      where: { 
        id: parseInt(playerId),
        ...excludeDeletedPlayer(),
      },
    });

    const game = await prisma.game.findFirst({
      where: { 
        id: parseInt(gameId),
        ...excludeDeletedGame(),
      },
    });

    if (!player || player.userId !== userId) {
      res.status(400).json({ error: 'Player not found or does not belong to the user' });
      return;
    }

    if (!game || game.userId !== userId) {
      res.status(400).json({ error: 'Game not found or does not belong to the user' });
      return;
    }

    // Find the player-game relation
    const playerGame = await prisma.playerGame.findFirst({
      where: {
        playerId: parseInt(playerId),
        gameId: parseInt(gameId),
        ...excludeDeletedPlayerGame(),
      },
    });

    if (!playerGame) {
      res.status(404).json({ error: 'Player is not linked to this game' });
      return;
    }

    // Soft delete the relation
    await prisma.playerGame.update({
      where: { id: playerGame.id },
      data: softDeletePlayerGameData(),
    });

    res.status(200).json({ message: 'Player removed from game successfully' });
  } catch (error) {
    console.error('Error removing player from game:', error);
    res.status(500).json({ error: 'Failed to remove player from game' });
  }
};

  