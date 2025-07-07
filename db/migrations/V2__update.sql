-- DROP TABLES in reverse order of dependencies (if they exist)
DROP TABLE IF EXISTS folder_sets;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS folders;
DROP TABLE IF EXISTS sets;
DROP TABLE IF EXISTS users;
DROP SEQUENCE IF EXISTS sqlite_sequence;

-- Create users table
CREATE TABLE users
(
    id       SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Create sets table
CREATE TABLE sets
(
    id      SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name    TEXT    NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Create cards table
CREATE TABLE cards
(
    id       SERIAL PRIMARY KEY,
    set_id   INTEGER NOT NULL,
    question TEXT    NOT NULL,
    answer   TEXT    NOT NULL,
    category TEXT,
    weight   INTEGER,
    FOREIGN KEY (set_id) REFERENCES sets (id) ON DELETE CASCADE
);

-- Create folders table
CREATE TABLE folders
(
    id        SERIAL PRIMARY KEY,
    name      TEXT    NOT NULL,
    parent_id INTEGER,
    user_id   INTEGER NOT NULL,
    FOREIGN KEY (parent_id) REFERENCES folders (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Create folder_sets table (many-to-many relation between folders and sets)
CREATE TABLE folder_sets
(
    folder_id INTEGER NOT NULL,
    set_id    INTEGER NOT NULL,
    PRIMARY KEY (folder_id, set_id),
    FOREIGN KEY (folder_id) REFERENCES folders (id) ON DELETE CASCADE,
    FOREIGN KEY (set_id) REFERENCES sets (id) ON DELETE CASCADE
);