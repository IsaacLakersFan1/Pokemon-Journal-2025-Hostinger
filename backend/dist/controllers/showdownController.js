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
exports.deleteShowdown = exports.updateShowdown = exports.getShowdownsByGame = exports.createShowdown = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const softDelete_1 = require("../utils/softDelete");
const POINTS_PER_WIN = 10;
const POINTS_PER_DEFEATED = -1;
function parseEventIds(json) {
    try {
        const arr = JSON.parse(json);
        return Array.isArray(arr) ? arr.map(Number).filter((n) => !isNaN(n)) : [];
    }
    catch (_a) {
        return [];
    }
}
function getDefeatedCountByPlayerInGame(gameId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const events = yield prismaClient_1.default.event.findMany({
            where: Object.assign(Object.assign({ gameId, status: "Defeated" }, (0, softDelete_1.excludeDeletedEvent)()), { game: { deletedAt: null } }),
            select: { playerId: true },
        });
        const map = new Map();
        for (const e of events) {
            map.set(e.playerId, ((_a = map.get(e.playerId)) !== null && _a !== void 0 ? _a : 0) + 1);
        }
        return map;
    });
}
const createShowdown = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(400).json({ error: "User not authenticated" });
        return;
    }
    const { gameId, player1Id, player2Id, winnerId, player1EventIds, player2EventIds, mvpEventId } = req.body;
    if (!gameId || !player1Id || !player2Id || !winnerId || !player1EventIds || !player2EventIds) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }
    const p1Ids = Array.isArray(player1EventIds) ? player1EventIds : parseEventIds(player1EventIds);
    const p2Ids = Array.isArray(player2EventIds) ? player2EventIds : parseEventIds(player2EventIds);
    const validCount = (ids) => ids.length >= 1 && ids.length <= 6;
    if (!validCount(p1Ids) || !validCount(p2Ids)) {
        res.status(400).json({ error: "Each player must have between 1 and 6 event IDs" });
        return;
    }
    try {
        const game = yield prismaClient_1.default.game.findFirst({
            where: Object.assign({ id: gameId, userId }, (0, softDelete_1.excludeDeletedGame)()),
        });
        if (!game) {
            res.status(404).json({ error: "Game not found" });
            return;
        }
        const showdown = yield prismaClient_1.default.showdown.create({
            data: {
                gameId,
                player1Id,
                player2Id,
                winnerId,
                player1EventIds: JSON.stringify(p1Ids),
                player2EventIds: JSON.stringify(p2Ids),
                mvpEventId: mvpEventId !== null && mvpEventId !== void 0 ? mvpEventId : null,
            },
            include: {
                player1: true,
                player2: true,
                winner: true,
                mvpEvent: { include: { pokemon: true, player: true } },
            },
        });
        res.status(201).json({ message: "Showdown created", showdown });
    }
    catch (error) {
        console.error("Error creating showdown:", error);
        res.status(500).json({ error: "Failed to create showdown" });
    }
});
exports.createShowdown = createShowdown;
const getShowdownsByGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const gameId = parseInt(req.params.gameId);
    if (!userId || !gameId) {
        res.status(400).json({ error: "Invalid request" });
        return;
    }
    try {
        const game = yield prismaClient_1.default.game.findFirst({
            where: Object.assign({ id: gameId, userId }, (0, softDelete_1.excludeDeletedGame)()),
            select: { id: true, name: true },
        });
        if (!game) {
            res.status(404).json({ error: "Game not found" });
            return;
        }
        const playerGames = yield prismaClient_1.default.playerGame.findMany({
            where: Object.assign({ gameId }, (0, softDelete_1.excludeDeletedPlayerGame)()),
            include: { player: { select: { id: true, name: true } } },
        });
        const players = playerGames.map((pg) => pg.player);
        const defeatedByPlayer = yield getDefeatedCountByPlayerInGame(gameId);
        const matchupKey = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`);
        const matchupsMap = new Map();
        for (let i = 0; i < players.length; i++) {
            for (let j = i + 1; j < players.length; j++) {
                const p1 = players[i];
                const p2 = players[j];
                const key = matchupKey(p1.id, p2.id);
                const p1Defeated = (_b = defeatedByPlayer.get(p1.id)) !== null && _b !== void 0 ? _b : 0;
                const p2Defeated = (_c = defeatedByPlayer.get(p2.id)) !== null && _c !== void 0 ? _c : 0;
                matchupsMap.set(key, {
                    player1Id: p1.id,
                    player2Id: p2.id,
                    player1Name: p1.name,
                    player2Name: p2.name,
                    showdowns: [],
                    player1Points: POINTS_PER_DEFEATED * p1Defeated,
                    player2Points: POINTS_PER_DEFEATED * p2Defeated,
                });
            }
        }
        const showdowns = yield prismaClient_1.default.showdown.findMany({
            where: Object.assign({ gameId }, (0, softDelete_1.excludeDeletedShowdown)()),
            include: {
                player1: { select: { id: true, name: true } },
                player2: { select: { id: true, name: true } },
                winner: { select: { id: true, name: true } },
                mvpEvent: {
                    include: {
                        pokemon: { select: { id: true, name: true, image: true } },
                        player: { select: { id: true, name: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        for (const s of showdowns) {
            const key = matchupKey(s.player1Id, s.player2Id);
            const m = matchupsMap.get(key);
            if (!m)
                continue;
            m.showdowns.push(s);
            if (s.winnerId === s.player1Id)
                m.player1Points += POINTS_PER_WIN;
            if (s.winnerId === s.player2Id)
                m.player2Points += POINTS_PER_WIN;
        }
        const matchups = Array.from(matchupsMap.values());
        res.status(200).json({ gameName: game.name, matchups });
    }
    catch (error) {
        console.error("Error fetching showdowns:", error);
        res.status(500).json({ error: "Failed to fetch showdowns" });
    }
});
exports.getShowdownsByGame = getShowdownsByGame;
const updateShowdown = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const showdownId = parseInt(req.params.id);
    if (!userId || !showdownId) {
        res.status(400).json({ error: "Invalid request" });
        return;
    }
    const { player1Id, player2Id, winnerId, player1EventIds, player2EventIds, mvpEventId } = req.body;
    try {
        const existing = yield prismaClient_1.default.showdown.findFirst({
            where: Object.assign({ id: showdownId }, (0, softDelete_1.excludeDeletedShowdown)()),
            include: { game: true },
        });
        if (!existing || existing.game.userId !== userId) {
            res.status(404).json({ error: "Showdown not found" });
            return;
        }
        const data = { updatedAt: new Date() };
        if (player1Id != null)
            data.player1Id = player1Id;
        if (player2Id != null)
            data.player2Id = player2Id;
        if (winnerId != null)
            data.winnerId = winnerId;
        if (player1EventIds != null)
            data.player1EventIds = typeof player1EventIds === "string" ? player1EventIds : JSON.stringify(player1EventIds);
        if (player2EventIds != null)
            data.player2EventIds = typeof player2EventIds === "string" ? player2EventIds : JSON.stringify(player2EventIds);
        if (mvpEventId !== undefined)
            data.mvpEventId = mvpEventId;
        const updated = yield prismaClient_1.default.showdown.update({
            where: { id: showdownId },
            data: data,
            include: {
                player1: true,
                player2: true,
                winner: true,
                mvpEvent: { include: { pokemon: true, player: true } },
            },
        });
        res.status(200).json({ message: "Showdown updated", showdown: updated });
    }
    catch (error) {
        console.error("Error updating showdown:", error);
        res.status(500).json({ error: "Failed to update showdown" });
    }
});
exports.updateShowdown = updateShowdown;
const deleteShowdown = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const showdownId = parseInt(req.params.id);
    if (!userId || !showdownId) {
        res.status(400).json({ error: "Invalid request" });
        return;
    }
    try {
        const existing = yield prismaClient_1.default.showdown.findFirst({
            where: Object.assign({ id: showdownId }, (0, softDelete_1.excludeDeletedShowdown)()),
            include: { game: true },
        });
        if (!existing || existing.game.userId !== userId) {
            res.status(404).json({ error: "Showdown not found" });
            return;
        }
        yield prismaClient_1.default.showdown.update({
            where: { id: showdownId },
            data: (0, softDelete_1.softDeleteShowdownData)(),
        });
        res.status(200).json({ message: "Showdown deleted" });
    }
    catch (error) {
        console.error("Error deleting showdown:", error);
        res.status(500).json({ error: "Failed to delete showdown" });
    }
});
exports.deleteShowdown = deleteShowdown;
