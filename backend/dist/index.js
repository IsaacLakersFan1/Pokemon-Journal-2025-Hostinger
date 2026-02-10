"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminUserRoutes_1 = __importDefault(require("./routes/adminUserRoutes"));
const settingsRoutes_1 = __importDefault(require("./routes/settingsRoutes"));
const gameRoutes_1 = __importDefault(require("./routes/gameRoutes"));
const playerRoutes_1 = __importDefault(require("./routes/playerRoutes"));
const playerGameRoutes_1 = __importDefault(require("./routes/playerGameRoutes"));
const pokemonRoutes_1 = __importDefault(require("./routes/pokemonRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const showdownRoutes_1 = __importDefault(require("./routes/showdownRoutes"));
const guessWhoRoutes_1 = __importDefault(require("./routes/guessWhoRoutes"));
const utilsRoutes_1 = __importDefault(require("./routes/utilsRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    credentials: true,
    origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:4173",
        "http://fswkskwc4sk40s8ok4c8s4sg.193.46.198.43.sslip.io",
        "http://ys0k0wsw0cc0840o4g88kc8w.193.46.198.43.sslip.io"
    ],
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", authRoutes_1.default);
app.use("/api/admin/user", adminUserRoutes_1.default);
app.use("/api/settings", settingsRoutes_1.default);
app.use("/api/games", gameRoutes_1.default);
app.use("/api/players", playerRoutes_1.default);
app.use("/api/player-games", playerGameRoutes_1.default);
app.use("/api/pokemon", pokemonRoutes_1.default);
app.use("/api/events", eventRoutes_1.default);
app.use("/api/showdowns", showdownRoutes_1.default);
app.use("/api/guess-who", guessWhoRoutes_1.default);
app.use("/api/utils", utilsRoutes_1.default);
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
