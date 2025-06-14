import "dotenv/config";
import express, { Request, Response } from "express";
import pgPromise from "pg-promise";
import { registerUser } from "./services/registerUser";

const pgp = pgPromise();
const db = pgp(process.env.DATABASE_URL as string);

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

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

app.post("/register", async (req: Request, res: Response) => {
  const { username, password, repeatPassword } = req.body as { username: string; password: string; repeatPassword: string };

  try {
    const result = await registerUser(username, password, repeatPassword);
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(PORT, () => console.log(`Server läuft auf http://localhost:${PORT}`));
