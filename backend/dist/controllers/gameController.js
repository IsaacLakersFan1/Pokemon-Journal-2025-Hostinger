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
exports.updateGame = exports.getGameById = exports.getAllGames = exports.restoreGame = exports.deleteGame = exports.createGame = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const softDelete_1 = require("../utils/softDelete");
// Create a new game
const createGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, playerCount } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // Access the userId from the JWT payload
    if (!userId) {
        res.status(400).json({ error: 'User not authenticated' });
        return;
    }
    try {
        const newGame = yield prismaClient_1.default.game.create({
            data: {
                name,
                playerCount,
                userId, // Associate the game with the authenticated user
            },
        });
        res.status(201).json({ message: 'Game created successfully', game: newGame });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create game' });
    }
});
exports.createGame = createGame;
// Soft Delete a game by ID
const deleteGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const gameId = parseInt(req.params.id);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(400).json({ error: 'User not authenticated' });
        return;
    }
    try {
        // Check if the game exists, is not soft-deleted, and is associated with the user
        const game = yield prismaClient_1.default.game.findFirst({
            where: Object.assign({ id: gameId }, (0, softDelete_1.excludeDeletedGame)()),
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
        yield prismaClient_1.default.game.update({
            where: { id: gameId },
            data: (0, softDelete_1.softDeleteGameData)(),
        });
        res.status(200).json({ message: 'Game deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting game:', error);
        res.status(500).json({ error: 'Failed to delete game' });
    }
});
exports.deleteGame = deleteGame;
// Restore soft-deleted game by ID
const restoreGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const gameId = parseInt(req.params.id);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(400).json({ error: 'User not authenticated' });
        return;
    }
    try {
        // Check if the soft-deleted game exists and is associated with the user
        const game = yield prismaClient_1.default.game.findFirst({
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
        const restoredGame = yield prismaClient_1.default.game.update({
            where: { id: gameId },
            data: (0, softDelete_1.restoreGameData)(),
        });
        res.status(200).json({
            message: 'Game restored successfully',
            game: restoredGame,
        });
    }
    catch (error) {
        console.error('Error restoring game:', error);
        res.status(500).json({ error: 'Failed to restore game' });
    }
});
exports.restoreGame = restoreGame;
// Get all games for the authenticated user
const getAllGames = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(400).json({ error: 'User not authenticated' });
        return;
    }
    try {
        // Fetch all non-deleted games for the authenticated user
        const games = yield prismaClient_1.default.game.findMany({
            where: Object.assign({ userId }, (0, softDelete_1.excludeDeletedGame)()),
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
    }
    catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});
exports.getAllGames = getAllGames;
// Get a single game by ID
const getGameById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const gameId = parseInt(req.params.id);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(400).json({ error: 'User not authenticated' });
        return;
    }
    try {
        const game = yield prismaClient_1.default.game.findFirst({
            where: Object.assign({ id: gameId, userId }, (0, softDelete_1.excludeDeletedGame)()),
            include: {
                playerGames: {
                    where: (0, softDelete_1.excludeDeletedPlayerGame)(),
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
    }
    catch (error) {
        console.error('Error fetching game:', error);
        res.status(500).json({ error: 'Failed to fetch game' });
    }
});
exports.getGameById = getGameById;
// Update game by ID
const updateGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const gameId = parseInt(req.params.id);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { name, playerCount } = req.body;
    if (!userId) {
        res.status(400).json({ error: 'User not authenticated' });
        return;
    }
    try {
        // Check if the game exists, is not soft-deleted, and is associated with the user
        const game = yield prismaClient_1.default.game.findFirst({
            where: Object.assign({ id: gameId }, (0, softDelete_1.excludeDeletedGame)()),
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
        const updatedGame = yield prismaClient_1.default.game.update({
            where: { id: gameId },
            data: (0, softDelete_1.updateGameData)({ name, playerCount }),
        });
        res.status(200).json({
            message: 'Game updated successfully',
            game: updatedGame,
        });
    }
    catch (error) {
        console.error('Error updating game:', error);
        res.status(500).json({ error: 'Failed to update game' });
    }
});
exports.updateGame = updateGame;
