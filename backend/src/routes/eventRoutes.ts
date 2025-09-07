import { Router } from 'express';
import { 
  createEvent, 
  searchPokemon, 
  getAllEvents, 
  getEventsByGameId, 
  updateEventStatus, 
  updateEventAttributes, 
  deleteEvent, 
  restoreEvent 
} from '../controllers/eventController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// POST: Create a new event (register a Pokémon event)
router.post('/', authenticateJWT, createEvent);

// GET: Search Pokémon by name
router.get('/pokemon/search', searchPokemon);

// GET: Get all events (optionally filtered by gameId)
router.get('/', authenticateJWT, getAllEvents);

// GET: Get events by Game ID
router.get('/game/:gameId', authenticateJWT, getEventsByGameId);

// PUT: Update event status
router.put('/:eventId/status', authenticateJWT, updateEventStatus);

// PUT: Update event attributes (isShiny, isChamp)
router.put('/:eventId/attributes', authenticateJWT, updateEventAttributes);

// DELETE: Soft delete event by ID
router.delete('/:eventId', authenticateJWT, deleteEvent);

// POST: Restore soft-deleted event by ID
router.post('/:eventId/restore', authenticateJWT, restoreEvent);

export default router;
