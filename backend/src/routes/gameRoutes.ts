import express from 'express';
import { createGame, deleteGame, getAllGames, updateGame, restoreGame } from '../controllers/gameController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

// Apply authenticateJWT middleware to game routes that require authentication
router.get('/', authenticateJWT, getAllGames);
router.post('/', authenticateJWT, createGame); // Create game
router.put('/:id', authenticateJWT, updateGame); // Update game
router.delete('/:id', authenticateJWT, deleteGame); // Soft delete game
router.post('/:id/restore', authenticateJWT, restoreGame); // Restore game

export default router;
