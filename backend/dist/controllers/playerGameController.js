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
exports.removePlayerFromGame = exports.getPlayersInGame = exports.createPlayerGame = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const softDelete_1 = require("../utils/softDelete");
// Create a relation between a player and a game
const createPlayerGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { playerId, gameId } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // Extract userId from the authenticated user
    if (!userId) {
        res.status(400).json({ error: 'User not authenticated' });
        return;
    }
    try {
        // Check if the player and game belong to the authenticated user and are not soft-deleted
        const player = yield prismaClient_1.default.player.findFirst({
            where: Object.assign({ id: playerId }, (0, softDelete_1.excludeDeletedPlayer)()),
        });
        const game = yield prismaClient_1.default.game.findFirst({
            where: Object.assign({ id: gameId }, (0, softDelete_1.excludeDeletedGame)()),
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
        const existingRelation = yield prismaClient_1.default.playerGame.findFirst({
            where: Object.assign({ playerId,
                gameId }, (0, softDelete_1.excludeDeletedPlayerGame)()),
        });
        if (existingRelation) {
            res.status(400).json({ error: 'Player is already linked to this game' });
            return;
        }
        // Create the player-game relation
        const newPlayerGame = yield prismaClient_1.default.playerGame.create({
            data: {
                playerId,
                gameId,
            },
        });
        res.status(201).json({ message: 'Player linked to game successfully', playerGame: newPlayerGame });
    }
    catch (error) {
        console.error('Error linking player to game:', error);
        res.status(500).json({ error: 'Failed to link player to game' });
    }
});
exports.createPlayerGame = createPlayerGame;
// Get all players associated with a specific game
const getPlayersInGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameId = parseInt(req.params.gameId);
    try {
        const players = yield prismaClient_1.default.playerGame.findMany({
            where: Object.assign({ gameId }, (0, softDelete_1.excludeDeletedPlayerGame)()),
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
    }
    catch (error) {
        console.error('Error fetching players for the game:', error);
        res.status(500).json({ error: 'Failed to fetch players for the game' });
    }
});
exports.getPlayersInGame = getPlayersInGame;
// Remove player from game (soft delete the relation)
const removePlayerFromGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { playerId, gameId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(400).json({ error: 'User not authenticated' });
        return;
    }
    try {
        // Check if the player and game belong to the authenticated user
        const player = yield prismaClient_1.default.player.findFirst({
            where: Object.assign({ id: parseInt(playerId) }, (0, softDelete_1.excludeDeletedPlayer)()),
        });
        const game = yield prismaClient_1.default.game.findFirst({
            where: Object.assign({ id: parseInt(gameId) }, (0, softDelete_1.excludeDeletedGame)()),
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
        const playerGame = yield prismaClient_1.default.playerGame.findFirst({
            where: Object.assign({ playerId: parseInt(playerId), gameId: parseInt(gameId) }, (0, softDelete_1.excludeDeletedPlayerGame)()),
        });
        if (!playerGame) {
            res.status(404).json({ error: 'Player is not linked to this game' });
            return;
        }
        // Soft delete the relation
        yield prismaClient_1.default.playerGame.update({
            where: { id: playerGame.id },
            data: (0, softDelete_1.softDeletePlayerGameData)(),
        });
        res.status(200).json({ message: 'Player removed from game successfully' });
    }
    catch (error) {
        console.error('Error removing player from game:', error);
        res.status(500).json({ error: 'Failed to remove player from game' });
    }
});
exports.removePlayerFromGame = removePlayerFromGame;
