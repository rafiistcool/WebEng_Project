import * as argon2 from "argon2";
import pgPromise from "pg-promise";

const pgp = pgPromise({});
const db = pgp(process.env.DATABASE_URL as string);


export async function registerUser(
    username: string,
    password: string,
    repeatPassword: string
): Promise<string> {
    // 1. Validierung der Eingaben
    if (!username || !password || !repeatPassword) {
        return "Alle Felder sind erforderlich.";
    }

    if (password !== repeatPassword) {
        return "Die Passwörter stimmen nicht überein.";
    }

    // Überprüfen, ob das Passwort sicher ist
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return "Das Passwort muss mindestens 8 Zeichen lang sein und Großbuchstaben, Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten.";
    }

    try {
        // 2. Prüfen, ob die E-Mail bereits existiert
        const userExists: { id: number } | null = await db.oneOrNone(
            "SELECT id FROM users WHERE username = $1",
            [username]
        );

        if (userExists) {
            return "Ein Benutzer mit dieser E-Mail existiert bereits.";
        }

        // 3. Passwort hashen
        const hashedPassword = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 1
        });


        // 4. Benutzer in die Datenbank einfügen
        await db.none(
            "INSERT INTO users (username, password) VALUES ($1, $2)",
            [username, hashedPassword]
        );

        return "Registrierung erfolgreich!";
    } catch (error) {
        console.error("Fehler bei der Registrierung:", error);
        return "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.";
    }
}