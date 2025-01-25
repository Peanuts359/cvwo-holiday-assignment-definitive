package handlers

import (
	"database/sql"
	"log"
	"net/http"

	"assignment-definitive/backend/utils"
	"github.com/gin-gonic/gin"
)

func LoginHandler(c *gin.Context, db *sql.DB) {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var storedPassword string
	err := db.QueryRow("SELECT password FROM users WHERE username = ?", req.Username).Scan(&storedPassword)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "The username entered is invalid"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if storedPassword != req.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "The password entered is incorrect"})
		return
	}

	token, err := utils.GenerateJWT(req.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	log.Println(token)
	c.JSON(http.StatusOK, gin.H{"token": token})
}
