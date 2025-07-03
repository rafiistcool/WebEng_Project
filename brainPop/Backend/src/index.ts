import "dotenv/config";
import express, { Request, Response } from "express";
import pgPromise from "pg-promise";
import cors from "cors";
import { registerUser } from "./services/registerUser";
import { loginUser } from "./services/loginUser";
import session from "express-session";

const pgp = pgPromise();
const db = pgp(process.env.DATABASE_URL as string);

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Nur Anfragen von Frontend erlauben
  methods: ['GET', 'POST'], // Nur bestimmte HTTP-Methoden erlauben
  credentials: true // Erlaubt das Senden von Cookies
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || "super-secret", // in .env ablegen!
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Auf true setzen, wenn du HTTPS verwendest
    maxAge: 1000 * 60 * 60 * 0.5 // 30 Min
  }
}));

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

app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body as { username: string; password: string };

  try {
    const result = await loginUser(username, password);
    if (result.success && result.userId) {
      req.session.userId = result.userId;
      res.status(200).json(result);
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.get("/session", (req: Request, res: Response) => {
  if (req.session.userId) {
    res.status(200).json({
      loggedIn: true,
      userId: req.session.userId
    });
  } else {
    res.status(200).json({
      loggedIn: false
    });
  }
});

app.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ success: false, message: "Fehler beim Abmelden" });
    } else {
      res.status(200).json({ success: true, message: "Erfolgreich abgemeldet" });
    }
  });
});


app.listen(PORT, () => console.log(`Server läuft auf http://localhost:${PORT}`));
