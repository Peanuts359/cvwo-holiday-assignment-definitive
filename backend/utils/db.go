package utils

import (
	"database/sql"
	"log"
	"sync"

	_ "modernc.org/sqlite"
)

var (
	db   *sql.DB
	once sync.Once
)

func GetDB() *sql.DB {
	once.Do(func() {
		var err error
		db, err = sql.Open("sqlite", "../database.db")
		if err != nil {
			log.Fatalf("Failed to connect to the database: %v", err)
		}

		log.Println("Database connection established successfully")
	})

	return db
}
