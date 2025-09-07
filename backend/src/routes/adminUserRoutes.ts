import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware";
import { getAllUsers, createUser, getUserById, updateUser, deleteUser } from "../controllers/adminUserController";

const router = express.Router();

router.post('/users', authenticateJWT, getAllUsers);
router.post('/users/create', authenticateJWT, createUser);
router.get('/users/:id', authenticateJWT, getUserById);
router.put('/users/update', authenticateJWT, updateUser);
router.put('/users/delete', authenticateJWT, deleteUser);

export default router;
