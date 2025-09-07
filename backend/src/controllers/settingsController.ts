import { Request, Response } from "express";
import path from "path";
import fs from "fs";

const DB_PATH = path.resolve(__dirname, "../../prisma/dev.db");


const downloadDB = async (req: Request, res: Response): Promise<void> => {
    if (!fs.existsSync(DB_PATH)) {
        res.status(404).send("Database file not found.");
        return;
    }

    // Use Express' built-in file download helper
    res.download(DB_PATH, "database.db", (err) => {
        if (err) {
            console.error("Download error:", err);
            res.status(500).send("Error downloading the file");
        }
    });
};



export { downloadDB };
