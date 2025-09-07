// src/routes/playerRoutes.ts
import { Router } from 'express';
import { createPlayer, updatePlayer, deletePlayer, getPlayers, getTrainerStats, getPokemonsStats, restorePlayer } from '../controllers/playerController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Route to get all players
router.get('/', authenticateJWT, getPlayers);

// Route to create a new player
router.post('/', authenticateJWT, createPlayer);

// Route to update a player by ID
router.put('/:id', authenticateJWT, updatePlayer);

// Route to soft delete a player by ID
router.delete('/:id', authenticateJWT, deletePlayer);

// Route to restore a soft-deleted player by ID
router.post('/:id/restore', authenticateJWT, restorePlayer);

// Route to get player stats by ID
router.get('/stats/:playerId', authenticateJWT, getTrainerStats);

// Route to get player stats by pokemon
router.get('/stats/pokemon/:playerId', authenticateJWT, getPokemonsStats);

export default router;
