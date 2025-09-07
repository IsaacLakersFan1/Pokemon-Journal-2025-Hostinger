import { Router } from 'express';
import { updatePokemonImages, getDatabaseStats } from '../controllers/utilsController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Update images of each Pokemon
router.post('/images', authenticateJWT, updatePokemonImages);

// Get database statistics
router.get('/stats', authenticateJWT, getDatabaseStats);

export default router;
