CREATE TABLE IF NOT EXISTS users (
                                     id         SERIAL PRIMARY KEY,
                                     username   TEXT    UNIQUE NOT NULL,
                                     password   TEXT           NOT NULL,
                                     created_at TIMESTAMPTZ    DEFAULT NOW()
    );

CREATE TABLE IF NOT EXISTS sets (
                                    id       SERIAL PRIMARY KEY,
                                    user_id  INTEGER     NOT NULL
                                    REFERENCES users(id)
    ON DELETE CASCADE,
    name     TEXT        NOT NULL
    );

CREATE TABLE IF NOT EXISTS cards (
                                     id        SERIAL PRIMARY KEY,
                                     set_id    INTEGER        NOT NULL
                                     REFERENCES sets(id)
    ON DELETE CASCADE,
    question  TEXT           NOT NULL,
    answer    TEXT           NOT NULL,
    category  TEXT
    );