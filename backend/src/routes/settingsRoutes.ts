import express from "express";
import { downloadDB } from "../controllers/settingsController";

const router = express.Router();

router.get("/download-db", downloadDB);

export default router;