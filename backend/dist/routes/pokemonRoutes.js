"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pokemonController_1 = require("../controllers/pokemonController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// POST: Create a new Pokémon
router.post('/', authMiddleware_1.authenticateJWT, pokemonController_1.createPokemon);
// GET: Get all Pokémon
router.get('/', pokemonController_1.getAllPokemon);
// GET: Search Pokémon by name
router.get('/search', pokemonController_1.searchPokemon);
// GET: Get Pokémon by ID
router.get('/:id', pokemonController_1.getPokemonById);
// PUT: Update Pokémon by ID
router.put('/:id', authMiddleware_1.authenticateJWT, pokemonController_1.updatePokemon);
// DELETE: Soft delete Pokémon by ID
router.delete('/:id', authMiddleware_1.authenticateJWT, pokemonController_1.deletePokemon);
// POST: Restore soft-deleted Pokémon by ID
router.post('/:id/restore', authMiddleware_1.authenticateJWT, pokemonController_1.restorePokemon);
// POST: Sync Pokémon from CSV
router.post('/sync', authMiddleware_1.authenticateJWT, pokemonController_1.syncPokemonFromCSV);
exports.default = router;
