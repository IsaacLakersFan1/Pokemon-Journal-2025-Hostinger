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
exports.restoreUser = exports.deleteUser = exports.updateUser = exports.getUserById = exports.createUser = exports.getAllUsers = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const softDelete_1 = require("../utils/softDelete");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, limit = 10, offset = 0 } = req.body;
        const whereClause = Object.assign(Object.assign({}, (0, softDelete_1.excludeDeleted)()), (search && {
            OR: [
                {
                    firstName: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    lastName: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    email: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    phone: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ],
        }));
        const [users, total] = yield Promise.all([
            prismaClient_1.default.user.findMany({
                where: whereClause,
                take: Number(limit),
                skip: Number(offset),
                orderBy: {
                    firstName: "asc",
                },
            }),
            prismaClient_1.default.user.count({
                where: whereClause,
            }),
        ]);
        res.status(200).json({
            users,
            total,
            limit: Number(limit),
            offset: Number(offset),
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener los usuarios" });
    }
});
exports.getAllUsers = getAllUsers;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, passwordHash, phone, role, username } = req.body;
        // Generate a default username if not provided
        const defaultUsername = username || `${firstName === null || firstName === void 0 ? void 0 : firstName.toLowerCase()}.${lastName === null || lastName === void 0 ? void 0 : lastName.toLowerCase()}` || `user_${Date.now()}`;
        // Generate a default password if not provided
        const defaultPassword = passwordHash || 'defaultPassword123';
        const user = yield prismaClient_1.default.user.create({
            data: {
                firstName,
                lastName,
                email,
                username: defaultUsername,
                password: defaultPassword,
                passwordHash: defaultPassword,
                phone,
                role
            },
        });
        res.status(201).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al crear el usuario", error: error instanceof Error ? error.message : "Error desconocido" });
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, firstName, lastName, email, passwordHash, phone, role } = req.body;
        const user = yield prismaClient_1.default.user.update({
            where: { id },
            data: (0, softDelete_1.updateData)({ firstName, lastName, email, passwordHash, phone, role }),
        });
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al actualizar el usuario" });
    }
});
exports.updateUser = updateUser;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield prismaClient_1.default.user.findUnique({
            where: { id: parseInt(id) },
        });
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener el usuario" });
    }
});
exports.getUserById = getUserById;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const user = yield prismaClient_1.default.user.update({
            where: { id },
            data: (0, softDelete_1.softDeleteData)(),
        });
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al eliminar el usuario" });
    }
});
exports.deleteUser = deleteUser;
const restoreUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const user = yield prismaClient_1.default.user.update({
            where: { id },
            data: (0, softDelete_1.restoreData)(),
        });
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al restaurar el usuario" });
    }
});
exports.restoreUser = restoreUser;
