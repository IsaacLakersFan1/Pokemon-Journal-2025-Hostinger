import { Router } from "express";
import { authenticateJWT } from "../middleware/authMiddleware";
import {
  createShowdown,
  getShowdownsByGame,
  updateShowdown,
  deleteShowdown,
} from "../controllers/showdownController";

const router = Router();

router.get("/game/:gameId", authenticateJWT, getShowdownsByGame);
router.post("/", authenticateJWT, createShowdown);
router.put("/:id", authenticateJWT, updateShowdown);
router.delete("/:id", authenticateJWT, deleteShowdown);

export default router;
