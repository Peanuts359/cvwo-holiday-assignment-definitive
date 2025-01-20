CREATE TABLE IF NOT EXISTS users (
                                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                                     username TEXT NOT NULL UNIQUE,
                                     email TEXT NOT NULL UNIQUE,
                                     password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS threads (
                                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                                       username TEXT NOT NULL,
                                       title TEXT NOT NULL,
                                       content TEXT NOT NULL
);