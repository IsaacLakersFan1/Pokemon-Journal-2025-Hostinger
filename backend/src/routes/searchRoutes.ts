import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware";
import { searchOwnerContent } from "../controllers/searchController";

const router = express.Router();

router.get("/", authenticateJWT, searchOwnerContent);

export default router;
