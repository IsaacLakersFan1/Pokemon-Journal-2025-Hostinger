"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guessWhoController_1 = require("../controllers/guessWhoController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get("/pokemons", authMiddleware_1.authenticateJWT, guessWhoController_1.getRandomPokemons);
exports.default = router;
