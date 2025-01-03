package main

import (
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize the database
	initDB()

	// Set up the router
	r := gin.Default()

	// Routes
	r.POST("/login", func(c *gin.Context) {
		loginHandler(c, db)
	})
	r.POST("/signup", func(c *gin.Context) {
		registerHandler(c, db)
	})
	r.POST("/reset-password", func(c *gin.Context) {
		resetHandler(c, db)
	})

	// Start the server
	log.Println("Server running on :8080")
	r.Run(":8080")
}
