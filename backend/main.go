package main

import (
	"database/sql"
	"log"

	"github.com/gin-gonic/gin"
	_ "modernc.org/sqlite"

	"assignment-definitive/backend/handlers"
	"github.com/gin-contrib/cors"
)

var db *sql.DB

func initDB() {
	var err error
	db, err = sql.Open("sqlite", "./database.db")
	if err != nil {
		log.Fatal("Failed to connect to the database:", err)
	}
	userSchema := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL UNIQUE,
		email TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL
	);`
	_, err = db.Exec(userSchema)
	if err != nil {
		log.Fatal("Failed to execute user schema:", err)
	}

	threadSchema := `
	CREATE TABLE IF NOT EXISTS threads (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
	    username TEXT NOT NULL,
		title TEXT NOT NULL,
        content TEXT NOT NULL,
	    tags TEXT NULL
	);`
	_, err = db.Exec(threadSchema)
	if err != nil {
		log.Fatal("Failed to execute thread schema:", err)
	}

	commentSchema := `
	CREATE TABLE IF NOT EXISTS comments (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		thread_id INTEGER NOT NULL,
		username TEXT NOT NULL,
		content TEXT NOT NULL,
		FOREIGN KEY (thread_id) REFERENCES threads (id) ON DELETE CASCADE
	);`
	_, err = db.Exec(commentSchema)
	if err != nil {
		log.Fatal("Failed to execute comment schema:", err)
	}

}

func main() {
	initDB()
	r := gin.Default()

	err := r.SetTrustedProxies(nil)
	if err != nil {
		log.Fatal("Failed to set trusted proxies:", err)
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization", "Username"},
		AllowCredentials: true,
	}))
	handlers.RegisterRoutes(r, db)

	log.Println("Server running on :8080")
	r.Run(":8080")
}
