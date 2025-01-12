CREATE TABLE IF NOT EXISTS users (
                                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                                     username TEXT NOT NULL UNIQUE,
                                     email TEXT NOT NULL UNIQUE,
                                     password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS thread
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content    TEXT NOT NULL,
    created_by   TEXT NOT NULL
);