import { expect, test, vi } from "vitest";
import { loginUser } from "../src/services/loginUser";
import db from "../src/db";
import * as argon2 from "argon2"

vi.mock("../src/db", () => ({
    default: {
        oneOrNone: vi.fn()
    }
}));

;

vi.mock("argon2", () => ({
    verify: vi.fn()
}));

test('should login a user successfully', async () => {
    // Arrange
    const username = "testuser";
    const password = "Test1234!";
    const mockUser = {
        id: 1,
        username: "testuser",
        password: "hashedPassword"
    };

    // Mock that user exists
    (db.oneOrNone as any).mockResolvedValue(mockUser);
    // Mock successful password verification
    (argon2.verify as any).mockResolvedValue(true);

    // Act
    const result = await loginUser(username, password);

    // Assert
    expect(result.success).toBe(true);
    expect(result.message).toBe("Anmeldung erfolgreich!");
    expect(result.userId).toBe(1);
    expect(db.oneOrNone).toHaveBeenCalledWith(
        "SELECT id, username, password FROM users WHERE username = $1",
        [username]
    );
    expect(argon2.verify).toHaveBeenCalledWith(mockUser.password, password);
});

test('should fail login with wrong password', async () => {
    // Arrange
    const username = "testuser";
    const password = "WrongPassword123!";
    const mockUser = {
        id: 1,
        username: "testuser",
        password: "hashedPassword"
    };

    // Mock that user exists
    (db.oneOrNone as any).mockResolvedValue(mockUser);
    // Mock failed password verification
    (argon2.verify as any).mockResolvedValue(false);

    // Act
    const result = await loginUser(username, password);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toBe("Ungültiger Benutzername oder Passwort.");
    expect(result.userId).toBeUndefined();
});

test('should fail login with non-existent user', async () => {
    // Arrange
    const username = "nonexistentuser";
    const password = "Test1234!";

    // Mock that user doesn't exist
    (db.oneOrNone as any).mockResolvedValue(null);

    // Act
    const result = await loginUser(username, password);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toBe("Ungültiger Benutzername oder Passwort.");
    expect(result.userId).toBeUndefined();
});

test('should fail login with missing credentials', async () => {
    // Arrange
    const username = "";
    const password = "";

    // Act
    const result = await loginUser(username, password);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toBe("Benutzername und Passwort sind erforderlich.");
    expect(result.userId).toBeUndefined();
});