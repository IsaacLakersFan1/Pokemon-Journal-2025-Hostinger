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
exports.getPokemonsStats = exports.getTrainerStats = exports.getPlayers = exports.restorePlayer = exports.deletePlayer = exports.updatePlayer = exports.createPlayer = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const softDelete_1 = require("../utils/softDelete");
// Type Guard for Pokemon Type
function isValidPokemonType(type) {
    const validTypes = [
        "Bug", "Dark", "Dragon", "Electric", "Fairy", "Fighting", "Fire", "Flying",
        "Ghost", "Grass", "Ground", "Ice", "Normal", "Poison", "Psychic", "Rock", "Steel", "Water"
    ];
    return validTypes.includes(type);
}
// Create a new player
const createPlayer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, pokemonId } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // Extract userId from the authenticated user
    if (!userId) {
        res.status(400).json({ error: 'User not authenticated' });
        return;
    }
    try {
        const newPlayer = yield prismaClient_1.default.player.create({
            data: {
                name,
                pokemonId,
                userId, // Associate player with authenticated user
            },
        });
        res.status(201).json({ message: 'Player created successfully', player: newPlayer });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create player' });
    }
});
exports.createPlayer = createPlayer;
// Update a player's information
const updatePlayer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const playerId = parseInt(req.params.id);
    const { name, pokemonId } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(400).json({ error: 'User not authenticated' });
        return;
    }
    try {
        // Check if the player exists, is not soft-deleted, and belongs to the user
        const player = yield prismaClient_1.default.player.findFirst({
            where: Object.assign({ id: playerId }, (0, softDelete_1.excludeDeletedPlayer)()),
        });
        if (!player) {
            res.status(404).json({ error: 'Player not found or already deleted' });
            return;
        }
        if (player.userId !== userId) {
            res.status(403).json({ error: 'You are not authorized to update this player' });
            return;
        }
        const updatedPlayer = yield prismaClient_1.default.player.update({
            where: { id: playerId },
            data: (0, softDelete_1.updatePlayerData)({ name, pokemonId }),
        });
        res.status(200).json({ message: 'Player updated successfully', player: updatedPlayer });
    }
    catch (error) {
        console.error('Error updating player:', error);
        res.status(500).json({ error: 'Failed to update player' });
    }
});
exports.updatePlayer = updatePlayer;
// Soft Delete a player by ID
const deletePlayer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const playerId = parseInt(req.params.id);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(400).json({ error: 'User not authenticated' });
        return;
    }
    try {
        // Check if the player exists, is not soft-deleted, and belongs to the user
        const player = yield prismaClient_1.default.player.findFirst({
            where: Object.assign({ id: playerId }, (0, softDelete_1.excludeDeletedPlayer)()),
        });
        if (!player) {
            res.status(404).json({ error: 'Player not found or already deleted' });
            return;
        }
        if (player.userId !== userId) {
            res.status(403).json({ error: 'You are not authorized to delete this player' });
            return;
        }
        // Soft delete the player
        yield prismaClient_1.default.player.update({
            where: { id: playerId },
            data: (0, softDelete_1.softDeletePlayerData)(),
        });
        res.status(200).json({ message: 'Player deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting player:', error);
        res.status(500).json({ error: 'Failed to delete player' });
    }
});
exports.deletePlayer = deletePlayer;
// Restore soft-deleted player by ID
const restorePlayer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const playerId = parseInt(req.params.id);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(400).json({ error: 'User not authenticated' });
        return;
    }
    try {
        // Check if the soft-deleted player exists and belongs to the user
        const player = yield prismaClient_1.default.player.findFirst({
            where: {
                id: playerId,
                deletedAt: { not: null },
            },
        });
        if (!player) {
            res.status(404).json({ error: 'Deleted player not found' });
            return;
        }
        if (player.userId !== userId) {
            res.status(403).json({ error: 'You are not authorized to restore this player' });
            return;
        }
        // Restore the player
        const restoredPlayer = yield prismaClient_1.default.player.update({
            where: { id: playerId },
            data: (0, softDelete_1.restorePlayerData)(),
        });
        res.status(200).json({
            message: 'Player restored successfully',
            player: restoredPlayer,
        });
    }
    catch (error) {
        console.error('Error restoring player:', error);
        res.status(500).json({ error: 'Failed to restore player' });
    }
});
exports.restorePlayer = restorePlayer;
// Get all players for the authenticated user
const getPlayers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    console.log('getPlayers called with userId:', userId);
    if (!userId) {
        res.status(400).json({ error: 'User not authenticated' });
        return;
    }
    try {
        // Fetch non-deleted players with related Pokémon data
        const players = yield prismaClient_1.default.player.findMany({
            where: Object.assign({ userId }, (0, softDelete_1.excludeDeletedPlayer)()),
            include: {
                pokemon: true,
                playerGames: {
                    include: {
                        game: true,
                    },
                },
                events: true,
            },
        });
        console.log('Players found:', players.length);
        res.status(200).json(players);
    }
    catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ error: 'Failed to fetch players' });
    }
});
exports.getPlayers = getPlayers;
// Trainer Stats Endpoint
const getTrainerStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { playerId } = req.params;
    const { gameId } = req.query; // Optional gameId to filter by game
    try {
        // Fetch player data (including name and Pokémon details) and events, optionally filtered by gameId
        const player = yield prismaClient_1.default.player.findFirst({
            where: Object.assign({ id: parseInt(playerId) }, (0, softDelete_1.excludeDeletedPlayer)()),
            include: {
                pokemon: true,
            },
        });
        // If player not found, return an error
        if (!player) {
            res.status(404).json({ message: 'Player not found or deleted' });
            return;
        }
        // Fetch player events, optionally filter by gameId
        const events = yield prismaClient_1.default.event.findMany({
            where: Object.assign(Object.assign({ playerId: parseInt(playerId) }, (gameId ? { gameId: parseInt(gameId) } : {})), (0, softDelete_1.excludeDeletedEvent)()),
            include: {
                pokemon: true,
            },
        });
        // Initialize stats object
        const stats = {
            playerName: player.name, // Add player name
            pokemon: player.pokemon, // Add player's Pokémon data
            caught: 0,
            runaway: 0,
            defeated: 0,
            shiny: 0,
            typeCounts: {
                Bug: 0,
                Dark: 0,
                Dragon: 0,
                Electric: 0,
                Fairy: 0,
                Fighting: 0,
                Fire: 0,
                Flying: 0,
                Ghost: 0,
                Grass: 0,
                Ground: 0,
                Ice: 0,
                Normal: 0,
                Poison: 0,
                Psychic: 0,
                Rock: 0,
                Steel: 0,
                Water: 0,
            },
        };
        // Iterate over events and calculate stats
        events.forEach((event) => {
            // Count statuses
            if (event.status === 'Catched')
                stats.caught++;
            if (event.status === 'Run Away')
                stats.runaway++;
            if (event.status === 'Defeated')
                stats.defeated++;
            // Count shinies
            if (event.isShiny === 1)
                stats.shiny++;
            // Count Pokémon types (both type1 and type2)
            if (event.pokemon) {
                const { type1, type2 } = event.pokemon;
                if (type1 && isValidPokemonType(type1)) {
                    stats.typeCounts[type1] = (stats.typeCounts[type1] || 0) + 1;
                }
                if (type2 && isValidPokemonType(type2)) {
                    stats.typeCounts[type2] = (stats.typeCounts[type2] || 0) + 1;
                }
            }
        });
        // Respond with the calculated stats and player information
        res.status(200).json(stats);
    }
    catch (error) {
        console.error('Error fetching trainer stats:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.getTrainerStats = getTrainerStats;
// Trainer Stats by Pokémon
const getPokemonsStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const playerId = parseInt(req.params.playerId); // Get playerId from URL parameter
    try {
        // Fetch all non-deleted Pokémon with their events (and shiny status) for the given playerId
        const pokemons = yield prismaClient_1.default.pokemon.findMany({
            where: (0, softDelete_1.excludeDeletedPokemon)(),
            include: {
                events: {
                    where: Object.assign({ playerId: playerId }, (0, softDelete_1.excludeDeletedEvent)()),
                    select: {
                        isShiny: true, // Select shiny status
                    },
                },
            },
        });
        // Map the Pokémon data to an array of objects
        const pokemonStats = pokemons.map((pokemon) => {
            const timesCaptured = pokemon.events.length;
            const shinyCapture = pokemon.events.some(event => event.isShiny === 1) ? 'yes' : 'no';
            return {
                id: pokemon.id,
                type1: pokemon.type1,
                type2: pokemon.type2,
                name: pokemon.name,
                form: pokemon.form,
                timesCaptured,
                shinyCapture,
                image: pokemon.image || null, // Regular image URL
                shinyImage: pokemon.shinyImage || null, // Shiny image URL
            };
        });
        // Send the result as a JSON response
        res.json(pokemonStats);
    }
    catch (error) {
        console.error('Error fetching Pokémon stats:', error);
        res.status(500).json({ message: 'An error occurred while fetching Pokémon stats.' });
    }
});
exports.getPokemonsStats = getPokemonsStats;
exports.default = exports.getTrainerStats;
