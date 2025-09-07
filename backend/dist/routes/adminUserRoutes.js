"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminUserController_1 = require("../controllers/adminUserController");
const router = express_1.default.Router();
router.post('/users', authMiddleware_1.authenticateJWT, adminUserController_1.getAllUsers);
router.post('/users/create', authMiddleware_1.authenticateJWT, adminUserController_1.createUser);
router.get('/users/:id', authMiddleware_1.authenticateJWT, adminUserController_1.getUserById);
router.put('/users/update', authMiddleware_1.authenticateJWT, adminUserController_1.updateUser);
router.put('/users/delete', authMiddleware_1.authenticateJWT, adminUserController_1.deleteUser);
exports.default = router;
