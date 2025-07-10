import { expect, test, vi } from "vitest";
import { registerUser } from "../src/services/registerUser";
import db from "../src/db";

// Mock the database
vi.mock("../src/db", () => ({
    default: {
        oneOrNone: vi.fn(),
        none: vi.fn()
    }
}));

// Mock argon2
vi.mock("argon2", () => ({
    hash: vi.fn().mockResolvedValue("hashedPassword"),
    argon2id: 2
}));

test('should register a new user successfully', async () => {
    // Arrange:
    const username = "testuser";
    const password = "Test1234!";
    const repeatPassword = "Test1234!";

    // Mock that user doesn't exist
    (db.oneOrNone as any).mockResolvedValue(null);
    (db.none as any).mockResolvedValue(null);

    // Act:
    const result = await registerUser(username, password, repeatPassword);

    // Assert:
    expect(result).toBe("Registrierung erfolgreich!");
    expect(db.oneOrNone).toHaveBeenCalledWith(
        "SELECT id FROM users WHERE username = $1",
        [username]
    );
    expect(db.none).toHaveBeenCalledWith(
        "INSERT INTO users (username, password) VALUES ($1, $2)",
        [username, "hashedPassword"]
    );
});

test('should throw error when passwords do not match', async () => {
    // Arrange
    const username = "testuser";
    const password = "Test1234!";
    const repeatPassword = "Test12345!";

    // Act & Assert
    await expect(registerUser(username, password, repeatPassword))
        .rejects.toThrow("Die Passwörter stimmen nicht überein.");
});

test('should throw error when user already exists', async () => {
    // Arrange
    const username = "existinguser";
    const password = "Test1234!";
    const repeatPassword = "Test1234!";

    // Mock that user exists
    (db.oneOrNone as any).mockResolvedValue({ id: 1 });

    // Act & Assert
    await expect(registerUser(username, password, repeatPassword))
        .rejects.toThrow("Ein Benutzer mit dieser E-Mail existiert bereits.");
});