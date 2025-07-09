import * as argon2 from "argon2";
import db from "../db";

export async function registerUser(
    username: string,
    password: string,
    repeatPassword: string
): Promise<string> {
    if (!username || !password || !repeatPassword) {
        return "Alle Felder sind erforderlich.";
    }
    if (password !== repeatPassword) {
        return "Die Passwörter stimmen nicht überein.";
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return "Das Passwort muss mindestens 8 Zeichen lang sein und Großbuchstaben, Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten.";
    }

    const normalizedUsername = username.toLowerCase();

    try {
        const userExists: { id: number } | null = await db.oneOrNone(
            "SELECT id FROM users WHERE username = $1",
            [normalizedUsername]
        );

        if (userExists) {
            return "Ein Benutzer mit dieser E-Mail existiert bereits.";
        }

        const hashedPassword = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 1
        });

        await db.none(
            "INSERT INTO users (username, password) VALUES ($1, $2)",
            [normalizedUsername, hashedPassword]
        );

        return "Registrierung erfolgreich!";
    } catch (error) {
        console.error("Fehler bei der Registrierung:", error);
        return "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.";
    }
}