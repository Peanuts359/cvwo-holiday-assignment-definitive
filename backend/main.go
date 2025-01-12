package main

import (
	"database/sql"
	"log"

	"github.com/gin-gonic/gin"
    _ "modernc.org/sqlite"

	"/backend/handlers"
	"/backend/accountCreation"
	"github.com/gin-contrib/cors"
)

var db *sql.DB

func initDB() {
	var err error
	db, err = sql.Open("sqlite", "./database.db")
	if err != nil {
		log.Fatal("Failed to connect to the database:", err)
	}
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
