import express from "express";
import { signup, login, me, logout } from "../controllers/authController";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', me);
router.post('/logout', logout);

export default router;
