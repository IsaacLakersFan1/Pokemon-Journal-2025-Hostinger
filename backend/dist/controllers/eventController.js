"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreEvent = exports.deleteEvent = exports.updateEventAttributes = exports.updateEventStatus = exports.getEventsByGameId = exports.getAllEvents = exports.searchPokemon = exports.createEvent = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const softDelete_1 = require("../utils/softDelete");
// Create a new event (register a Pokémon event)
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pokemonId, route, nickname, status, isShiny, isChamp, gameId, playerId } = req.body;
    try {
        // Create the event in the database
        const newEvent = yield prismaClient_1.default.event.create({
            data: {
                pokemonId,
                route,
                nickname,
                status: status || 'Catched', // Default to 'Catched' if not provided
                isShiny,
                isChamp,
                gameId,
                playerId, // Directly associate the event with a player
            },
            include: {
                player: true, // Include player details in the response
                pokemon: true, // Include Pokémon details in the response
            },
        });
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    }
    catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
});
exports.createEvent = createEvent;
// Search Pokémon by part of their name
const searchPokemon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchTerm = req.query.searchTerm;
        console.log('searchPokemon called with searchTerm:', searchTerm);
        if (typeof searchTerm === 'string') {
            const pokemons = yield prismaClient_1.default.pokemon.findMany({
                where: Object.assign({ name: { contains: searchTerm.toLowerCase() } }, (0, softDelete_1.excludeDeletedPokemon)()),
                select: {
                    id: true,
                    name: true,
                    form: true,
                    image: true,
                },
            });
            console.log('Pokemon found:', pokemons.length);
            res.json(pokemons);
        }
        else {
            res.status(400).json({ error: 'Invalid search term' });
        }
    }
    catch (error) {
        console.error('Error searching Pokémon:', error);
        res.status(500).json({ error: 'Failed to search Pokémon' });
    }
});
exports.searchPokemon = searchPokemon;
// Get all events (you can also filter by gameId or other criteria)
const getAllEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract gameId from query parameters
        const { gameId } = req.query;
        // Build the filter condition
        const whereCondition = gameId
            ? Object.assign({ gameId: Number(gameId) }, (0, softDelete_1.excludeDeletedEvent)()) : (0, softDelete_1.excludeDeletedEvent)();
        const events = yield prismaClient_1.default.event.findMany({
            where: whereCondition, // Apply the filter if gameId is provided
            include: {
                player: true,
                pokemon: true,
            },
        });
        res.status(200).json({ events });
    }
    catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});
exports.getAllEvents = getAllEvents;
// Get events by Game ID
const getEventsByGameId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { gameId } = req.params;
    try {
        const events = yield prismaClient_1.default.event.findMany({
            where: Object.assign({ gameId: parseInt(gameId) }, (0, softDelete_1.excludeDeletedEvent)()),
            include: {
                player: true,
                pokemon: true,
            },
        });
        res.status(200).json({ events });
    }
    catch (error) {
        console.error('Error fetching events for game:', error);
        res.status(500).json({ error: 'Failed to fetch events for the game' });
    }
});
exports.getEventsByGameId = getEventsByGameId;
const updateEventStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    const { status } = req.body;
    // Validate input
    const validStatuses = ['Catched', 'Run Away', 'Defeated'];
    if (!validStatuses.includes(status)) {
        res.status(400).json({ error: 'Invalid status provided.' });
        return;
    }
    try {
        // Check if event exists and is not soft-deleted
        const existingEvent = yield prismaClient_1.default.event.findFirst({
            where: Object.assign({ id: Number(eventId) }, (0, softDelete_1.excludeDeletedEvent)()),
        });
        if (!existingEvent) {
            res.status(404).json({ error: 'Event not found or has been deleted.' });
            return;
        }
        // Update event status with updatedAt timestamp
        const updatedEvent = yield prismaClient_1.default.event.update({
            where: { id: Number(eventId) },
            data: (0, softDelete_1.updateEventData)({ status }),
        });
        res.status(200).json({ message: 'Status updated successfully', event: updatedEvent });
    }
    catch (error) {
        console.error('Error updating event status:', error);
        res.status(500).json({ error: 'Failed to update event status.' });
    }
});
exports.updateEventStatus = updateEventStatus;
const updateEventAttributes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId } = req.params;
        const { isShiny, isChamp } = req.body;
        // Validate input
        if (typeof isShiny !== 'number' || typeof isChamp !== 'number') {
            res.status(400).json({ error: "Invalid input. 'isShiny' and 'isChamp' must be numbers." });
            return;
        }
        // Check if event exists and is not soft-deleted
        const existingEvent = yield prismaClient_1.default.event.findFirst({
            where: Object.assign({ id: Number(eventId) }, (0, softDelete_1.excludeDeletedEvent)()),
        });
        if (!existingEvent) {
            res.status(404).json({ error: 'Event not found or has been deleted.' });
            return;
        }
        // Update the event with updatedAt timestamp
        const updatedEvent = yield prismaClient_1.default.event.update({
            where: { id: Number(eventId) },
            data: (0, softDelete_1.updateEventData)({
                isShiny,
                isChamp
            }),
        });
        res.status(200).json({
            message: 'Event attributes updated successfully',
            event: updatedEvent,
        });
    }
    catch (error) {
        console.error('Error updating event attributes:', error);
        res.status(500).json({
            error: 'Failed to update event attributes.',
        });
    }
});
exports.updateEventAttributes = updateEventAttributes;
// Soft Delete Event by ID
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    try {
        // Find the event to ensure it exists and is not already soft-deleted
        const event = yield prismaClient_1.default.event.findFirst({
            where: Object.assign({ id: parseInt(eventId) }, (0, softDelete_1.excludeDeletedEvent)()),
        });
        if (!event) {
            res.status(404).json({ message: 'Event not found or already deleted.' });
            return;
        }
        // Soft delete the event
        yield prismaClient_1.default.event.update({
            where: { id: parseInt(eventId) },
            data: (0, softDelete_1.softDeleteEventData)(),
        });
        res.status(200).json({ message: 'Event successfully deleted.' });
    }
    catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'An error occurred while deleting the event.' });
    }
});
exports.deleteEvent = deleteEvent;
// Restore soft-deleted Event by ID
const restoreEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    try {
        // Find the soft-deleted event
        const event = yield prismaClient_1.default.event.findFirst({
            where: {
                id: parseInt(eventId),
                deletedAt: { not: null },
            },
        });
        if (!event) {
            res.status(404).json({ message: 'Deleted event not found.' });
            return;
        }
        // Restore the event
        const restoredEvent = yield prismaClient_1.default.event.update({
            where: { id: parseInt(eventId) },
            data: (0, softDelete_1.restoreEventData)(),
        });
        res.status(200).json({
            message: 'Event successfully restored.',
            event: restoredEvent,
        });
    }
    catch (error) {
        console.error('Error restoring event:', error);
        res.status(500).json({ message: 'An error occurred while restoring the event.' });
    }
});
exports.restoreEvent = restoreEvent;
