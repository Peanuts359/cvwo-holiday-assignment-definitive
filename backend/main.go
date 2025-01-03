package main

import (
	"database/sql"
	"log"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"

	"assignment-definitive/backend/handlers"
)

var db *sql.DB

func initDB() {
	var err error
	db, err = sql.Open("sqlite3", "./database.db")
	if err != nil {
		log.Fatal("Failed to connect to the database:", err)
	}

	// Read and execute schema.sql
	schema := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL UNIQUE,
		email TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL
	);`
	_, err = db.Exec(schema)
	if err != nil {
		log.Fatal("Failed to execute schema:", err)
	}
}

func main() {
	// Initialize the database
	initDB()

	// Set up the router
	r := gin.Default()

	// Register routes from handlers
	handlers.RegisterRoutes(r, db)

	// Start the server
	log.Println("Server running on :8080")
	r.Run(":8080")
}
