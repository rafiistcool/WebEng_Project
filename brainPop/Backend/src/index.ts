import "dotenv/config";
import express, {Request, Response} from "express";
import db from "./db";
import cors from "cors";
import {registerUser} from "./services/registerUser";
import {loginUser} from "./services/loginUser";
import {
    getSets,
    createSet,
    updateSet,
    deleteSet,
    getCards,
    createCard,
    updateCard,
    deleteCard,
    getFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    addSetToFolder,
    removeSetFromFolder,
    getFolderSets,
    getFolderHierarchy
} from "./services/dataServices";
import {Card, Folder, Set} from "./types";
import session from "express-session";

const PORT = process.env.PORT || 90;

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL as string, // Nur Anfragen von Frontend erlauben
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Nur bestimmte HTTP-Methoden erlauben
    credentials: true // Erlaubt das Senden von Cookies
}));

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // true für https
        maxAge: 1000 * 60 * 60 * 0.5 // 30 Min
    }
}));


type ErrorResponse = { error: string };

app.get("/", (_req: Request, res: Response) => {
    res.send("Hello Express ✨");
});

app.get("/test", async (_req: Request, res: Response) => {
    try {
        const data = await db.any("SELECT * FROM users,sets,cards");
        res.json(data);
    } catch (err) {
        res.status(500).json({error: (err as Error).message});
    }
});

app.post("/register", async (req: Request, res: Response) => {
    const {username, password, repeatPassword} = req.body as {
        username: string;
        password: string;
        repeatPassword: string
    };
    try {
        const result = await registerUser(username, password, repeatPassword);
        res.status(200).json({message: result});
    } catch (error) {
        res.status(500).json({message: (error as Error).message});
    }
});

app.post("/login", async (req: Request, res: Response) => {
    const {username, password} = req.body as { username: string; password: string };

    try {
        const result = await loginUser(username, password);
        if (result.success && result.userId) {
            req.session.userId = result.userId;
            res.status(200).json(result);
        } else {
            console.error("Fehler bei der Anmeldung:", result.message);
            res.status(401).json(result);
        }
    } catch (error) {
        console.error("Fehler bei der Anmeldung:", error);
        res.status(500).json({success: false, message: (error as Error).message});
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
            res.status(500).json({success: false, message: "Fehler beim Abmelden"});
        } else {
            res.status(200).json({success: true, message: "Erfolgreich abgemeldet"});
        }
    });
});

app.get("/sets", async (req: Request<Record<string, never>, Set[] | ErrorResponse, undefined, {
    userId?: string
}>, res: Response<Set[] | ErrorResponse>) => {
    try {
        const {userId} = req.query;
        if (!userId) {
            res.status(400).json({error: "User ID is required"});
        } else {
            const sets: Set[] = await getSets(parseInt(userId));
            res.status(200).json(sets);
        }
    } catch (error) {
        res.status(500).json({error: (error as Error).message});
    }
});

app.post("/sets", async (req: Request<Record<string, never>, Set | ErrorResponse, {
    userId: number;
    name: string
}>, res: Response<Set | ErrorResponse>) => {
    try {
        const {userId, name} = req.body;
        if (!userId || !name) {
            res.status(400).json({error: "User ID and name are required"});
        } else {
            const newSet: Set = await createSet(userId, name);
            res.status(201).json(newSet);
        }
    } catch (error) {
        res.status(500).json({error: (error as Error).message});
    }
});

app.put("/sets/:id", async (req: Request<{ id: string }, Set | ErrorResponse, {
    name: string
}>, res: Response<Set | ErrorResponse>) => {
    try {
        const setId = parseInt(req.params.id);
        const {name} = req.body;
        if (!name) {
            res.status(400).json({error: "Name is required"});
        } else {
            const updatedSet: Set = await updateSet(setId, name);
            res.status(200).json(updatedSet);
        }
    } catch (error) {
        res.status(500).json({error: (error as Error).message});
    }
});

app.delete("/sets/:id", async (req: Request<{
    id: string
}, void | ErrorResponse>, res: Response<void | ErrorResponse>) => {
    try {
        const setId = parseInt(req.params.id);
        await deleteSet(setId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({error: (error as Error).message});
    }
});

app.get("/cards", async (req: Request<Record<string, never>, Card[] | ErrorResponse, undefined, {
    setId: string
}>, res: Response<Card[] | ErrorResponse>) => {
    try {
        const {setId} = req.query;
        if (!setId) {
            res.status(400).json({error: "Set ID is required"});
        } else {
            const cards: Card[] = await getCards(parseInt(setId));
            res.status(200).json(cards);
        }
    } catch (error) {
        res.status(500).json({error: (error as Error).message});
    }
});

app.post("/cards", async (req: Request<Record<string, never>, Card | ErrorResponse, {
    setId: number;
    question: string;
    answer: string;
    category?: string;
    weight?: number;
}>, res: Response<Card | ErrorResponse>) => {
    try {
        const {setId, question, answer, category, weight} = req.body;
        if (!setId || !question || !answer) {
            res.status(400).json({error: "Set ID, question, and answer are required"});
        } else {
            const newCard: Card = await createCard(setId, question, answer, category, weight);
            res.status(201).json(newCard);
        }
    } catch (error) {
        res.status(500).json({error: (error as Error).message});
    }
});

app.put("/cards/:id", async (req: Request<{ id: string }, Card | ErrorResponse, {
    question: string;
    answer: string;
    category?: string;
    weight?: number;
}>, res: Response<Card | ErrorResponse>) => {
    try {
        const cardId = parseInt(req.params.id);
        const {question, answer, category, weight} = req.body;
        if (!question || !answer) {
            res.status(400).json({error: "Question and answer are required"});
        } else {
            const updatedCard: Card = await updateCard(cardId, question, answer, category, weight);
            res.status(200).json(updatedCard);
        }
    } catch (error) {
        res.status(500).json({error: (error as Error).message});
    }
});

app.delete("/cards/:id", async (req: Request<{
    id: string
}, void | ErrorResponse>, res: Response<void | ErrorResponse>) => {
    try {
        const cardId = parseInt(req.params.id);
        await deleteCard(cardId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({error: (error as Error).message});
    }
});

app.get("/folders", async (req: Request<Record<string, never>, Folder[] | ErrorResponse, undefined, {
    userId: string;
    parentId?: string
}>, res: Response<Folder[] | ErrorResponse>) => {
    try {
        const {userId, parentId} = req.query;
        if (!userId) {
            res.status(400).json({error: "User ID is required"});
        } else {
            const folders: Folder[] = await getFolders(parseInt(userId), parentId ? parseInt(parentId) : undefined);
            res.status(200).json(folders);
        }
    } catch (error) {
        res.status(500).json({error: (error as Error).message});
    }
});

app.post("/folders", async (req: Request<Record<string, never>, Folder | ErrorResponse, {
    userId: number;
    name: string;
    parentId?: number;
}>, res: Response<Folder | ErrorResponse>) => {
    try {
        const {userId, name, parentId} = req.body;
        if (!userId || !name) {
            res.status(400).json({error: "User ID and name are required"});
        } else {
            const newFolder: Folder = await createFolder(userId, name, parentId);
            res.status(201).json(newFolder);
        }
    } catch (error) {
        res.status(500).json({error: (error as Error).message});
    }
});

app.put("/folders/:id", async (req: Request<{ id: string }, Folder | ErrorResponse, {
    name: string;
    parentId?: number
}>, res: Response<Folder | ErrorResponse>) => {
    try {
        const folderId = parseInt(req.params.id);
        const {name, parentId} = req.body;
        if (!name) {
            res.status(400).json({error: "Name is required"});
        } else {
            const updatedFolder: Folder = await updateFolder(folderId, name, parentId);
            res.status(200).json(updatedFolder);
        }
    } catch (error) {
        res.status(500).json({error: (error as Error).message});
    }
});

app.delete("/folders/:id", async (req: Request<{
    id: string
}, void | ErrorResponse>, res: Response<void | ErrorResponse>) => {
    try {
        const folderId = parseInt(req.params.id);
        await deleteFolder(folderId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({error: (error as Error).message});
    }
});

app.post("/folders/:folderId/sets/:setId", async (req: Request<{
    folderId: string;
    setId: string
}, void | ErrorResponse>, res: Response<void | ErrorResponse>) => {
    try {
        const folderId = parseInt(req.params.folderId);
        const setId = parseInt(req.params.setId);
        await addSetToFolder(folderId, setId);
        res.status(201).send();
    } catch (error) {
        res.status(500).json({error: (error as Error).message});
    }
});

app.delete("/folders/:folderId/sets/:setId", async (req: Request<{
    folderId: string;
    setId: string
}, void | ErrorResponse>, res: Response<void | ErrorResponse>) => {
    try {
        const folderId = parseInt(req.params.folderId);
        const setId = parseInt(req.params.setId);
        await removeSetFromFolder(folderId, setId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({error: (error as Error).message});
    }
});

app.get("/folders/:folderId/sets", async (req: Request<{
    folderId: string
}, Set[] | ErrorResponse>, res: Response<Set[] | ErrorResponse>) => {
    try {
        const folderId = parseInt(req.params.folderId);
        const sets: Set[] = await getFolderSets(folderId);
        res.status(200).json(sets);
    } catch (error) {
        res.status(500).json({error: (error as Error).message});
    }
});

app.get("/folders/hierarchy", async (req: Request<Record<string, never>, unknown[] | ErrorResponse, undefined, {
    userId: string
}>, res: Response<unknown[] | ErrorResponse>) => {
    try {
        const {userId} = req.query;
        if (!userId) {
            res.status(400).json({error: "User ID is required"});
        } else {
            const hierarchy = await getFolderHierarchy(parseInt(userId));
            res.status(200).json(hierarchy);
        }
    } catch (error) {
        res.status(500).json({error: (error as Error).message});
    }
});

app.get("/sets/:setId/cards", async (req: Request<{
    setId: string
}, Card[] | ErrorResponse>, res: Response<Card[] | ErrorResponse>) => {
    try {
        console.log("request SETID" + req.params.setId);
        const setId = parseInt(req.params.setId);
        const cards: Card[] = await getCards(setId);
        res.status(200).json(cards);
    } catch (error) {
        res.status(500).json({error: (error as Error).message});
    }
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
}).on("error", (err) => {
    console.error("Fehler beim Starten des Servers:", err);
    process.exit(1);
});