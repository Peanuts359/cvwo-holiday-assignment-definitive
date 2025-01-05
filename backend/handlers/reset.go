package handlers

import (
	"database/sql"
	"net/http"
	"github.com/gin-gonic/gin"
)

func ResetHandler(c *gin.Context, db *sql.DB) {
	var req struct {
		Email       string `json:"email"`
		NewPassword string `json:"newPassword"`
	}

	if err := c.ShouldBindJSON(&req); err != nil || req.Email == "" || req.NewPassword == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var emailExists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = ?)", req.Email).Scan(&emailExists)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query the database"})
		return
	}

	if !emailExists {
		c.JSON(http.StatusNotFound, gin.H{"error": "No account uses this email"})
		return
	}

	_, err = db.Exec("UPDATE users SET password = ? WHERE email = ?", req.NewPassword, req.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password reset successful"})
}
