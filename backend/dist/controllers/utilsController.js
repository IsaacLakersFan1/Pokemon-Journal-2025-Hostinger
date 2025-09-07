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
exports.getDatabaseStats = exports.updatePokemonImages = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const softDelete_1 = require("../utils/softDelete");
const updatePokemonImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all non-deleted Pokémon records
        const pokemons = yield prismaClient_1.default.pokemon.findMany({
            where: (0, softDelete_1.excludeDeletedPokemon)(),
        });
        // Prepare update promises
        const updatePromises = pokemons.map((pokemon) => {
            var _a, _b;
            return prismaClient_1.default.pokemon.update({
                where: { id: pokemon.id },
                data: (0, softDelete_1.updatePokemonData)({
                    image: ((_a = pokemon.name) !== null && _a !== void 0 ? _a : "unknown").toLowerCase(),
                    shinyImage: `${((_b = pokemon.name) !== null && _b !== void 0 ? _b : "unknown").toLowerCase()}-shiny`,
                }),
            });
        });
        // Execute updates
        yield Promise.all(updatePromises);
        res.status(200).json({
            message: "Pokemon images updated successfully!",
            updatedCount: pokemons.length,
        });
    }
    catch (error) {
        console.error("Error updating Pokémon images:", error);
        res.status(500).json({ error: "Failed to update Pokémon images." });
    }
});
exports.updatePokemonImages = updatePokemonImages;
// Get database statistics
const getDatabaseStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield Promise.all([
            prismaClient_1.default.user.count({ where: { deletedAt: null } }),
            prismaClient_1.default.game.count({ where: { deletedAt: null } }),
            prismaClient_1.default.player.count({ where: { deletedAt: null } }),
            prismaClient_1.default.pokemon.count({ where: { deletedAt: null } }),
            prismaClient_1.default.event.count({ where: { deletedAt: null } }),
            prismaClient_1.default.playerGame.count({ where: { deletedAt: null } }),
        ]);
        const [users, games, players, pokemons, events, playerGames] = stats;
        res.status(200).json({
            message: "Database statistics retrieved successfully",
            stats: {
                users,
                games,
                players,
                pokemons,
                events,
                playerGames,
            },
        });
    }
    catch (error) {
        console.error("Error fetching database statistics:", error);
        res.status(500).json({ error: "Failed to fetch database statistics." });
    }
});
exports.getDatabaseStats = getDatabaseStats;
