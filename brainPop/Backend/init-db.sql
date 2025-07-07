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

-- Insert some test data
INSERT INTO users (username, password) VALUES ('testuser', 'password123');

-- Get the user ID
DO $$
DECLARE
    user_id INTEGER;
BEGIN
    SELECT id INTO user_id FROM users WHERE username = 'testuser';
    
    -- Insert sets
    INSERT INTO sets (user_id, name) VALUES (user_id, 'Math Set');
    INSERT INTO sets (user_id, name) VALUES (user_id, 'Science Set');
    
    -- Insert folders
    INSERT INTO folders (user_id, name) VALUES (user_id, 'School');
    INSERT INTO folders (user_id, name) VALUES (user_id, 'Personal');
    
    -- Get set IDs
    DECLARE
        math_set_id INTEGER;
        science_set_id INTEGER;
    BEGIN
        SELECT id INTO math_set_id FROM sets WHERE name = 'Math Set';
        SELECT id INTO science_set_id FROM sets WHERE name = 'Science Set';
        
        -- Insert cards
        INSERT INTO cards (set_id, question, answer, category) 
        VALUES (math_set_id, 'What is 2+2?', '4', 'Addition');
        
        INSERT INTO cards (set_id, question, answer, category) 
        VALUES (math_set_id, 'What is 5*5?', '25', 'Multiplication');
        
        INSERT INTO cards (set_id, question, answer, category) 
        VALUES (science_set_id, 'What is H2O?', 'Water', 'Chemistry');
        
        -- Get folder IDs
        DECLARE
            school_folder_id INTEGER;
        BEGIN
            SELECT id INTO school_folder_id FROM folders WHERE name = 'School';
            
            -- Add sets to folders
            INSERT INTO folder_sets (folder_id, set_id) 
            VALUES (school_folder_id, math_set_id);
            
            INSERT INTO folder_sets (folder_id, set_id) 
            VALUES (school_folder_id, science_set_id);
        END;
    END;
END $$;