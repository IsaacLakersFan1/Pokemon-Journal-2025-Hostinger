"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.switchAccount = exports.logout = exports.me = exports.signup = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const zod_1 = require("zod");
const JWT_SECRET = process.env.JWT_SECRET || "isaacBasketballTracker2025";
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
const signupSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    // username: z.string().min(3),
    password: zod_1.z.string().min(6),
    firstName: zod_1.z.string().min(3),
    lastName: zod_1.z.string().min(3)
});
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ message: "Invalid input" });
        return;
    }
    const { email, password, firstName, lastName } = result.data;
    try {
        const existingUser = yield prismaClient_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: "Email already in use" });
            return;
        }
        const existingUsername = yield prismaClient_1.default.user.findUnique({ where: { email } });
        if (existingUsername) {
            res.status(400).json({ message: "Username already in use" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield prismaClient_1.default.user.create({
            data: {
                email,
                username: email,
                password: hashedPassword, // Keep using password column for now
                passwordHash: hashedPassword, // Also store in passwordHash
                firstName,
                lastName
            }
        });
        res.status(201).json({ message: "User created successfully", user: newUser });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ message: "Invalid input" });
        return;
    }
    const { email, password } = result.data;
    try {
        const user = yield prismaClient_1.default.user.findUnique({
            where: { email }
        });
        if (!user) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.passwordHash || user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "30d" });
        res.cookie("tokenPokemonJournal", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });
        res.status(200).json({ message: "Login successful", token, user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.login = login;
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.tokenPokemonJournal;
        if (!token) {
            res.status(401).json({ message: "No token provided" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = yield prismaClient_1.default.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true
            }
        });
        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ user });
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid token" });
    }
});
exports.me = me;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("tokenPokemonJournal");
        res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.logout = logout;
const switchAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.body) === null || _a === void 0 ? void 0 : _a.token;
    if (!token || typeof token !== "string") {
        res.status(400).json({ message: "Token is required" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = yield prismaClient_1.default.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, firstName: true, lastName: true, email: true, role: true }
        });
        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        res.cookie("tokenPokemonJournal", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({ message: "Account switched", user });
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid token" });
    }
});
exports.switchAccount = switchAccount;
