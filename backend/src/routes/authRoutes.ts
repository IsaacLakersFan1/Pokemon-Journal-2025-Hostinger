import express from "express";
import { signup, login, me, logout, switchAccount } from "../controllers/authController";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', me);
router.post('/logout', logout);
router.post('/switch-account', switchAccount);

export default router;
