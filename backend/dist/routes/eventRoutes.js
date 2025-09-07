"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../controllers/eventController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// POST: Create a new event (register a Pokémon event)
router.post('/', authMiddleware_1.authenticateJWT, eventController_1.createEvent);
// GET: Search Pokémon by name
router.get('/pokemon/search', eventController_1.searchPokemon);
// GET: Get all events (optionally filtered by gameId)
router.get('/', authMiddleware_1.authenticateJWT, eventController_1.getAllEvents);
// GET: Get events by Game ID
router.get('/game/:gameId', authMiddleware_1.authenticateJWT, eventController_1.getEventsByGameId);
// PUT: Update event status
router.put('/:eventId/status', authMiddleware_1.authenticateJWT, eventController_1.updateEventStatus);
// PUT: Update event attributes (isShiny, isChamp)
router.put('/:eventId/attributes', authMiddleware_1.authenticateJWT, eventController_1.updateEventAttributes);
// DELETE: Soft delete event by ID
router.delete('/:eventId', authMiddleware_1.authenticateJWT, eventController_1.deleteEvent);
// POST: Restore soft-deleted event by ID
router.post('/:eventId/restore', authMiddleware_1.authenticateJWT, eventController_1.restoreEvent);
exports.default = router;
