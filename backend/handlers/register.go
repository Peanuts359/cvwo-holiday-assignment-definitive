package handlers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

func RegisterHandler(c *gin.Context, db *sql.DB) {
	var req struct {
		Username string `json:"username"` // Username field
		Email    string `json:"email"`    // Email field
		Password string `json:"password"` // Password field
	}

	if err := c.ShouldBindJSON(&req); err != nil || req.Username == "" || req.Email == "" || req.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input. Please provide username, email, and password."})
		return
	}

	_, err := db.Exec("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", req.Username, req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create account. The username or email may already exist."})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Account created successfully"})
}
