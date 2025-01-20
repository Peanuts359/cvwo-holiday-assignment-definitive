package user_content

import (
	"assignment-definitive/backend/utils"
	"database/sql"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

func EditThreadHandler(c *gin.Context, db *sql.DB) {
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing Authorization header"})
		return
	}
	username, err := utils.UsernameFromToken(strings.TrimPrefix(tokenString, "Bearer "))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Thread ID is required"})
		return
	}

	var newContent string

	if err := c.ShouldBindJSON(&newContent); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// failsafe: make sure that only the poster can edit a thread under their username
	var threadOwner string
	err = db.QueryRow("SELECT username FROM threads WHERE id = ?", id).Scan(&threadOwner)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Thread not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify thread ownership"})
		return
	}

	if threadOwner != username {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to edit this thread"})
		return
	}

	// continued edit logic
	query := "UPDATE threads SET content = ? WHERE id = ?"
	_, err = db.Exec(query, newContent, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to edit thread"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Thread edited successfully"})
}
