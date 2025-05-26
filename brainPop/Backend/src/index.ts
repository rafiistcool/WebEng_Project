import "dotenv/config";
import express, { Request, Response } from "express";
import pgPromise from "pg-promise";

const pgp = pgPromise();
const db = pgp("postgresql://admin:brainpop69@45.93.249.43:5432/flashcards");

const PORT = process.env.PORT || 3000;

const app = express();

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello Express ✨");
});

app.get("/test", async (_req: Request, res: Response) => {
  try {
    const data = await db.any("SELECT * FROM users,sets,cards");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.listen(PORT, () => console.log(`Server läuft auf http://localhost:${PORT}`));
