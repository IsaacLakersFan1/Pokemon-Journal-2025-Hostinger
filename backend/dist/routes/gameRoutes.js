"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gameController_1 = require("../controllers/gameController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Apply authenticateJWT middleware to game routes that require authentication
router.get('/', authMiddleware_1.authenticateJWT, gameController_1.getAllGames);
router.get('/:id', authMiddleware_1.authenticateJWT, gameController_1.getGameById);
router.post('/', authMiddleware_1.authenticateJWT, gameController_1.createGame); // Create game
router.put('/:id', authMiddleware_1.authenticateJWT, gameController_1.updateGame); // Update game
router.delete('/:id', authMiddleware_1.authenticateJWT, gameController_1.deleteGame); // Soft delete game
router.post('/:id/restore', authMiddleware_1.authenticateJWT, gameController_1.restoreGame); // Restore game
exports.default = router;
