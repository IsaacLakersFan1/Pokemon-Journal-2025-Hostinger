"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const playerGameController_1 = require("../controllers/playerGameController");
const router = (0, express_1.Router)();
// Route to create the player-game relation
router.post('/', authMiddleware_1.authenticateJWT, playerGameController_1.createPlayerGame);
// Route to get players associated with a game
router.get('/:gameId', authMiddleware_1.authenticateJWT, playerGameController_1.getPlayersInGame);
// Route to remove player from game (soft delete relation)
router.delete('/:playerId/:gameId', authMiddleware_1.authenticateJWT, playerGameController_1.removePlayerFromGame);
exports.default = router;
