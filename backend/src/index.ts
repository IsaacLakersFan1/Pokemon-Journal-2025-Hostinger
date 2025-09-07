import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import adminUserRoutes from "./routes/adminUserRoutes";
import settingsRoutes from "./routes/settingsRoutes";
import gameRoutes from "./routes/gameRoutes";
import playerRoutes from "./routes/playerRoutes";
import playerGameRoutes from "./routes/playerGameRoutes";
import pokemonRoutes from "./routes/pokemonRoutes";
import eventRoutes from "./routes/eventRoutes";
import utilsRoutes from "./routes/utilsRoutes";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:4173",
      "http://n0ksgoooc40sckswwk8cgkso.193.46.198.43.sslip.io",
      "http://yw8g0o4oksscgswgs4848c4o.193.46.198.43.sslip.io"
    ],
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/admin/user", adminUserRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/player-games", playerGameRoutes);
app.use("/api/pokemon", pokemonRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/utils", utilsRoutes);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});

