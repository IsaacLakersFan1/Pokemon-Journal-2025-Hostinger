import { Router } from "express";
import { getRandomPokemons } from "../controllers/guessWhoController";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = Router();

router.get("/pokemons", authenticateJWT, getRandomPokemons);

export default router;
