import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { createPlayerGame, getPlayersInGame, removePlayerFromGame } from '../controllers/playerGameController';

const router = Router();

// Route to create the player-game relation
router.post('/', authenticateJWT, createPlayerGame);
// Route to get players associated with a game
router.get('/:gameId', authenticateJWT, getPlayersInGame);
// Route to remove player from game (soft delete relation)
router.delete('/:playerId/:gameId', authenticateJWT, removePlayerFromGame);

export default router;
