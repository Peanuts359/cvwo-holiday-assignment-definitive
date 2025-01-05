package handlers

import (
	"database/sql"
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
	if err == sql.ErrNoRows || storedPassword != req.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "You entered an invalid username/password"})
		return
	}

	token, err := utils.GenerateJWT(req.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}
