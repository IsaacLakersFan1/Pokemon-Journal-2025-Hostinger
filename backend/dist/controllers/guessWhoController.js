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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomPokemons = void 0;
const POKEAPI_BASE = "https://pokeapi.co/api/v2/pokemon";
const COUNT = 20;
const MAX_POKEMON_ID = 1025;
function getRandomIds(count) {
    const ids = [];
    while (ids.length < count) {
        const id = Math.floor(Math.random() * MAX_POKEMON_ID) + 1;
        if (!ids.includes(id))
            ids.push(id);
    }
    return ids;
}
const getRandomPokemons = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ids = getRandomIds(COUNT);
        const results = yield Promise.all(ids.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const response = yield fetch(`${POKEAPI_BASE}/${id}`);
            if (!response.ok)
                return null;
            const data = (yield response.json());
            const image = (_f = (_d = (_c = (_b = (_a = data.sprites) === null || _a === void 0 ? void 0 : _a.other) === null || _b === void 0 ? void 0 : _b["official-artwork"]) === null || _c === void 0 ? void 0 : _c.front_default) !== null && _d !== void 0 ? _d : (_e = data.sprites) === null || _e === void 0 ? void 0 : _e.front_default) !== null && _f !== void 0 ? _f : null;
            const types = data.types.map((t) => t.type.name);
            return {
                id: data.id,
                name: data.name,
                image,
                types,
            };
        })));
        const pokemons = results.filter((p) => p !== null);
        res.status(200).json(pokemons);
    }
    catch (error) {
        console.error("Error fetching random Pokémon:", error);
        res.status(500).json({ message: "Error al obtener Pokémon aleatorios" });
    }
});
exports.getRandomPokemons = getRandomPokemons;
