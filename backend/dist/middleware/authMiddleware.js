"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.tokenPokemonJournal;
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }
    if (!JWT_SECRET) {
        res.status(500).json({ message: 'JWT_SECRET is not defined' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(403).json({ message: 'Invalid token' });
        return;
    }
};
exports.authenticateJWT = authenticateJWT;
