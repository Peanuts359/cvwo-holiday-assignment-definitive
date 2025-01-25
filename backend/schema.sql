CREATE TABLE IF NOT EXISTS users (
                                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                                     username TEXT NOT NULL UNIQUE,
                                     email TEXT NOT NULL UNIQUE,
                                     password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS threads (
                                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                                       username TEXT NOT NULL,
                                       title TEXT NOT NULL UNIQUE,
                                       content TEXT NOT NULL,
                                       tags TEXT NULL,
                                       upvotes INTEGER DEFAULT 0,
                                       downvotes INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS comments (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        thread_id INTEGER NOT NULL,
                                        username TEXT NOT NULL,
                                        content TEXT NOT NULL,
                                        FOREIGN KEY (thread_id) REFERENCES threads (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_votes (
                                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                                          user_id INTEGER NOT NULL,
                                          thread_id INTEGER NOT NULL,
                                          vote_type TEXT CHECK(vote_type IN ('upvote', 'downvote')),
                                          UNIQUE(user_id, thread_id),
                                          FOREIGN KEY (thread_id) REFERENCES threads (id)
);