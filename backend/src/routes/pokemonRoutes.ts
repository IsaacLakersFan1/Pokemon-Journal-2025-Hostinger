import { Router } from 'express';
import { createPokemon, getAllPokemon, getPokemonById, updatePokemon, deletePokemon, restorePokemon, searchPokemon, syncPokemonFromCSV } from '../controllers/pokemonController';
import { authenticateJWT } from '../middleware/authMiddleware'; 

const router = Router();

// POST: Create a new Pokémon
router.post('/', authenticateJWT, createPokemon);

// GET: Get all Pokémon
router.get('/', getAllPokemon);

// GET: Search Pokémon by name
router.get('/search', searchPokemon);

// GET: Get Pokémon by ID
router.get('/:id', getPokemonById);

// PUT: Update Pokémon by ID
router.put('/:id', authenticateJWT, updatePokemon);

// DELETE: Soft delete Pokémon by ID
router.delete('/:id', authenticateJWT, deletePokemon);

// POST: Restore soft-deleted Pokémon by ID
router.post('/:id/restore', authenticateJWT, restorePokemon);

// POST: Sync Pokémon from CSV
router.post('/sync', authenticateJWT, syncPokemonFromCSV);

export default router;
