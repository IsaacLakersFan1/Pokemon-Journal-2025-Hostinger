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
exports.syncPokemonFromCSV = exports.restorePokemon = exports.deletePokemon = exports.updatePokemon = exports.getPokemonById = exports.searchPokemon = exports.getAllPokemon = exports.createPokemon = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const softDelete_1 = require("../utils/softDelete");
// Set up Multer storage (save images to "public" folder)
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, "../../public/PokemonImages")); // Save to "PokemonImages" folder inside public
    },
    filename: (req, file, cb) => {
        try {
            const { name, form } = req.body; // Access Pokémon name and form from the request body
            if (!name) {
                return cb(new Error("Pokémon name is required for naming the file"), "");
            }
            // Normalize the Pokémon name
            let lowerCaseName = name.toLowerCase().replace(/\s+/g, "-"); // Convert name to lowercase and replace spaces with dashes
            // If form includes "Mega" or "mega," prefix the name with "mega-"
            if (form && /mega/i.test(form)) {
                lowerCaseName = `mega-${lowerCaseName}`;
            }
            cb(null, `${lowerCaseName}.png`); // Save file as 'name.png'
        }
        catch (err) {
            cb(err, "");
        }
    },
});
// Validate file type (only PNG)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png") {
        cb(null, true);
    }
    else {
        cb(new Error("Only PNG files are allowed!"), false);
    }
};
// Multer middleware
const upload = (0, multer_1.default)({ storage, fileFilter });
// Create a new Pokémon
const createPokemon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Handle the image upload via multer middleware
    upload.single("image")(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        const { nationalDex, name, form, type1, type2, hp, attack, defense, specialAttack, specialDefense, speed, generation, } = req.body;
        // Calculate total points
        const total = parseInt(hp) +
            parseInt(attack) +
            parseInt(defense) +
            parseInt(specialAttack) +
            parseInt(specialDefense) +
            parseInt(speed);
        try {
            // Normalize the Pokémon name
            let lowerCaseName = name.toLowerCase().replace(/\s+/g, "-"); // Replace spaces with dashes
            // If form includes "Mega" or "mega," prefix the name with "mega-"
            if (form && /mega/i.test(form)) {
                lowerCaseName = `mega-${lowerCaseName}`;
            }
            // Use the normalized name for image and shiny image
            const image = lowerCaseName;
            const shinyImage = `${lowerCaseName}-shiny`;
            // Create Pokémon record in the DB
            const newPokemon = yield prismaClient_1.default.pokemon.create({
                data: {
                    nationalDex: parseInt(nationalDex),
                    name,
                    form,
                    type1,
                    type2,
                    total,
                    hp: parseInt(hp),
                    attack: parseInt(attack),
                    defense: parseInt(defense),
                    specialAttack: parseInt(specialAttack),
                    specialDefense: parseInt(specialDefense),
                    speed: parseInt(speed),
                    generation: parseInt(generation),
                    image,
                    shinyImage,
                },
            });
            res
                .status(201)
                .json({ message: "Pokémon created successfully", pokemon: newPokemon });
        }
        catch (error) {
            console.error("Error creating Pokémon:", error);
            res.status(500).json({ error: "Failed to create Pokémon" });
        }
    }));
});
exports.createPokemon = createPokemon;
// Get all Pokémon
const getAllPokemon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pokemons = yield prismaClient_1.default.pokemon.findMany({
            where: (0, softDelete_1.excludeDeletedPokemon)(),
            include: {
                events: true,
                player: true,
            },
        });
        res.status(200).json({ pokemons });
    }
    catch (error) {
        console.error('Error fetching Pokémon:', error);
        res.status(500).json({ error: 'Failed to fetch Pokémon' });
    }
});
exports.getAllPokemon = getAllPokemon;
// Search Pokémon by part of their name
const searchPokemon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchTerm = req.query.searchTerm;
        console.log('searchPokemon called with searchTerm:', searchTerm);
        if (typeof searchTerm === 'string') {
            const pokemons = yield prismaClient_1.default.pokemon.findMany({
                where: Object.assign({ name: { contains: searchTerm.toLowerCase() } }, (0, softDelete_1.excludeDeletedPokemon)()),
                select: {
                    id: true,
                    name: true,
                    form: true,
                    image: true,
                },
            });
            console.log('Pokemon found:', pokemons.length);
            res.json(pokemons);
        }
        else {
            res.status(400).json({ error: 'Invalid search term' });
        }
    }
    catch (error) {
        console.error('Error searching Pokémon:', error);
        res.status(500).json({ error: 'Failed to search Pokémon' });
    }
});
exports.searchPokemon = searchPokemon;
// Get a Pokémon by ID
const getPokemonById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const pokemon = yield prismaClient_1.default.pokemon.findFirst({
            where: Object.assign({ id: parseInt(id) }, (0, softDelete_1.excludeDeletedPokemon)()),
            include: {
                events: true,
                player: true,
            },
        });
        if (!pokemon) {
            res.status(404).json({ error: 'Pokémon not found or deleted' });
            return;
        }
        // Calculate type effectiveness
        const typeEffectivenessData = calculateEffectiveness(pokemon.type1, pokemon.type2);
        res.status(200).json({ pokemon, typeEffectiveness: typeEffectivenessData });
    }
    catch (error) {
        console.error('Error fetching Pokémon:', error);
        res.status(500).json({ error: 'Failed to fetch Pokémon' });
    }
});
exports.getPokemonById = getPokemonById;
// Updated endpoint to handle image uploads and Pokémon updates
const updatePokemon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    upload.single("image")(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        const { id } = req.params;
        const { name, form, type1, type2, total, hp, attack, defense, specialAttack, specialDefense, speed, generation, } = req.body;
        try {
            // Check if Pokémon exists and is not soft-deleted
            const existingPokemon = yield prismaClient_1.default.pokemon.findFirst({
                where: Object.assign({ id: parseInt(id) }, (0, softDelete_1.excludeDeletedPokemon)()),
            });
            if (!existingPokemon) {
                res.status(404).json({ error: 'Pokémon not found or deleted' });
                return;
            }
            const data = {
                name,
                form,
                type1,
                type2,
                total: parseInt(total),
                hp: parseInt(hp),
                attack: parseInt(attack),
                defense: parseInt(defense),
                specialAttack: parseInt(specialAttack),
                specialDefense: parseInt(specialDefense),
                speed: parseInt(speed),
                generation: parseInt(generation),
            };
            // If a file was uploaded, update the image field (save without extension)
            if (req.file) {
                const imageNameWithoutExtension = path_1.default.basename(req.file.filename, path_1.default.extname(req.file.filename));
                data.image = imageNameWithoutExtension; // Save only the name without the extension
            }
            const updatedPokemon = yield prismaClient_1.default.pokemon.update({
                where: { id: parseInt(id) },
                data: (0, softDelete_1.updatePokemonData)(data),
            });
            res.status(200).json({ message: "Pokémon updated successfully", pokemon: updatedPokemon });
        }
        catch (error) {
            console.error("Error updating Pokémon:", error);
            res.status(500).json({ error: "Failed to update Pokémon" });
        }
    }));
});
exports.updatePokemon = updatePokemon;
// Soft Delete a Pokémon by ID
const deletePokemon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Check if Pokémon exists and is not already soft-deleted
        const pokemon = yield prismaClient_1.default.pokemon.findFirst({
            where: Object.assign({ id: parseInt(id) }, (0, softDelete_1.excludeDeletedPokemon)()),
        });
        if (!pokemon) {
            res.status(404).json({ error: 'Pokémon not found or already deleted' });
            return;
        }
        // Soft delete the Pokémon
        const deletedPokemon = yield prismaClient_1.default.pokemon.update({
            where: { id: parseInt(id) },
            data: (0, softDelete_1.softDeletePokemonData)(),
        });
        res.status(200).json({ message: 'Pokémon deleted successfully', pokemon: deletedPokemon });
    }
    catch (error) {
        console.error('Error deleting Pokémon:', error);
        res.status(500).json({ error: 'Failed to delete Pokémon' });
    }
});
exports.deletePokemon = deletePokemon;
// Restore soft-deleted Pokémon by ID
const restorePokemon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Check if soft-deleted Pokémon exists
        const pokemon = yield prismaClient_1.default.pokemon.findFirst({
            where: {
                id: parseInt(id),
                deletedAt: { not: null },
            },
        });
        if (!pokemon) {
            res.status(404).json({ error: 'Deleted Pokémon not found' });
            return;
        }
        // Restore the Pokémon
        const restoredPokemon = yield prismaClient_1.default.pokemon.update({
            where: { id: parseInt(id) },
            data: (0, softDelete_1.restorePokemonData)(),
        });
        res.status(200).json({
            message: 'Pokémon restored successfully',
            pokemon: restoredPokemon
        });
    }
    catch (error) {
        console.error('Error restoring Pokémon:', error);
        res.status(500).json({ error: 'Failed to restore Pokémon' });
    }
});
exports.restorePokemon = restorePokemon;
// Type Effectiveness Chart
const typeEffectiveness = {
    Normal: { Rock: 0.5, Steel: 0.5, Ghost: 0 },
    Fire: { Grass: 2, Ice: 2, Bug: 2, Steel: 2, Fire: 0.5, Water: 0.5, Rock: 0.5, Dragon: 0.5 },
    Water: { Fire: 2, Ground: 2, Rock: 2, Water: 0.5, Grass: 0.5, Dragon: 0.5 },
    Grass: {
        Water: 2,
        Ground: 2,
        Rock: 2,
        Fire: 0.5,
        Grass: 0.5,
        Poison: 0.5,
        Flying: 0.5,
        Bug: 0.5,
        Dragon: 0.5,
        Steel: 0.5,
    },
    Electric: { Water: 2, Flying: 2, Electric: 0.5, Grass: 0.5, Dragon: 0.5, Ground: 0 },
    Ice: { Grass: 2, Ground: 2, Flying: 2, Dragon: 2, Fire: 0.5, Water: 0.5, Ice: 0.5, Steel: 0.5 },
    Fighting: { Normal: 2, Ice: 2, Rock: 2, Dark: 2, Steel: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Fairy: 0.5, Ghost: 0 },
    Poison: { Grass: 2, Fairy: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0 },
    Ground: { Fire: 2, Electric: 2, Poison: 2, Rock: 2, Steel: 2, Grass: 0.5, Bug: 0.5, Flying: 0 },
    Flying: { Grass: 2, Fighting: 2, Bug: 2, Electric: 0.5, Rock: 0.5, Steel: 0.5 },
    Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Steel: 0.5, Dark: 0 },
    Bug: { Grass: 2, Psychic: 2, Dark: 2, Fire: 0.5, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Ghost: 0.5, Steel: 0.5, Fairy: 0.5 },
    Rock: { Fire: 2, Ice: 2, Flying: 2, Bug: 2, Fighting: 0.5, Ground: 0.5, Steel: 0.5 },
    Ghost: { Psychic: 2, Ghost: 2, Dark: 0.5, Normal: 0 },
    Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
    Dark: { Psychic: 2, Ghost: 2, Dark: 0.5, Fairy: 0.5 },
    Steel: { Ice: 2, Rock: 2, Fairy: 2, Fire: 0.5, Water: 0.5, Electric: 0.5, Steel: 0.5 },
    Fairy: { Fighting: 2, Dragon: 2, Dark: 2, Fire: 0.5, Poison: 0.5, Steel: 0.5 },
};
// Calculate Effectiveness
const calculateEffectiveness = (type1, type2) => {
    const effectiveness = {};
    Object.keys(typeEffectiveness).forEach((attackingType) => {
        let multiplier = typeEffectiveness[attackingType][type1] || 1;
        if (type2) {
            multiplier *= typeEffectiveness[attackingType][type2] || 1;
        }
        effectiveness[attackingType] = multiplier;
    });
    return effectiveness;
};
// Sync Pokémon from CSV file
const syncPokemonFromCSV = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const csvPath = path_1.default.join(__dirname, '../../prisma/pokemondb.csv');
        if (!fs_1.default.existsSync(csvPath)) {
            res.status(404).json({ error: 'CSV file not found' });
            return;
        }
        const pokemonData = [];
        // Read CSV file
        fs_1.default.createReadStream(csvPath)
            .pipe((0, csv_parser_1.default)())
            .on('data', (row) => {
            pokemonData.push({
                id: parseInt(row.id),
                nationalDex: parseInt(row.nationalDex),
                name: row.name,
                form: row.form || null,
                type1: row.type1,
                type2: row.type2 || null,
                total: parseInt(row.total),
                hp: parseInt(row.hp),
                attack: parseInt(row.attack),
                defense: parseInt(row.defense),
                specialAttack: parseInt(row.specialAttack),
                specialDefense: parseInt(row.specialDefense),
                speed: parseInt(row.speed),
                generation: parseInt(row.generation),
                image: row.image || null,
                shinyImage: row.shinyImage || null,
            });
        })
            .on('end', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Clear existing Pokémon data
                yield prismaClient_1.default.pokemon.deleteMany({});
                // Insert new Pokémon data
                const result = yield prismaClient_1.default.pokemon.createMany({
                    data: pokemonData,
                });
                res.status(200).json({
                    message: 'Pokémon synchronized successfully',
                    count: result.count,
                    total: pokemonData.length
                });
            }
            catch (error) {
                console.error('Error inserting Pokémon data:', error);
                res.status(500).json({ error: 'Failed to insert Pokémon data' });
            }
        }))
            .on('error', (error) => {
            console.error('Error reading CSV file:', error);
            res.status(500).json({ error: 'Failed to read CSV file' });
        });
    }
    catch (error) {
        console.error('Error syncing Pokémon:', error);
        res.status(500).json({ error: 'Failed to sync Pokémon' });
    }
});
exports.syncPokemonFromCSV = syncPokemonFromCSV;
