import * as argon2 from "argon2";
import db from "../db";

export async function loginUser(
    username: string,
    password: string
): Promise<{ success: boolean; message: string; userId?: number }> {
    if (!username || !password) {
        return { success: false, message: "Benutzername und Passwort sind erforderlich." };
    }

    try {
        interface DbUser {
            id: number;
            username: string;
            password: string;
        }

        const normalizedUsername = username.toLowerCase();

        const user = await db.oneOrNone<DbUser>(
            "SELECT id, username, password FROM users WHERE username = $1",
            [normalizedUsername]
        );

        if (!user) {
            return { success: false, message: "Ungültiger Benutzername oder Passwort." };
        }

        const passwordValid = await argon2.verify(user.password, password);
        
        if (!passwordValid) {
            return { success: false, message: "Ungültiger Benutzername oder Passwort." };
        }

        return { 
            success: true, 
            message: "Anmeldung erfolgreich!",
            userId: user.id
        };
    } catch (error) {
        console.error("Fehler bei der Anmeldung:", error);
        return { success: false, message: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." };
    }
}