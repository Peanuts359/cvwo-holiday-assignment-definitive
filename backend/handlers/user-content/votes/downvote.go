package votes

import (
	"assignment-definitive/backend/utils"
	"database/sql"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"strings"
)

func DownvoteThreadHandler(c *gin.Context, db *sql.DB) {
	threadID := c.Param("thread_id")
	log.Println("downvoting thread: " + threadID)

	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing Authorization header"})
		return
	}
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	username, err := utils.UsernameFromToken(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	var userID int
	query := "SELECT id FROM users WHERE username = ?"
	err = db.QueryRow(query, username).Scan(&userID)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB Error"})
		return
	}

	var existingVote string
	err = db.QueryRow("SELECT vote_type FROM user_votes WHERE user_id = ? AND thread_id = ?", userID, threadID).Scan(&existingVote)

	if err == sql.ErrNoRows {
		_, err := db.Exec("INSERT INTO user_votes (user_id, thread_id, vote_type) VALUES (?, ?, 'downvote')", userID, threadID)
		if err == nil {
			db.Exec("UPDATE threads SET downvotes = downvotes + 1 WHERE id = ?", threadID)
			c.JSON(http.StatusOK, gin.H{"message": "Downvoted successfully"})
			return
		}
	} else if existingVote == "downvote" {
		_, err := db.Exec("DELETE FROM user_votes WHERE user_id = ? AND thread_id = ?", userID, threadID)
		if err == nil {
			db.Exec("UPDATE threads SET downvotes = downvotes - 1 WHERE id = ?", threadID)
			c.JSON(http.StatusOK, gin.H{"message": "Downvote removed"})
			return
		}
	} else if existingVote == "upvote" {
		_, err := db.Exec("UPDATE user_votes SET vote_type = 'downvote' WHERE user_id = ? AND thread_id = ?", userID, threadID)
		if err == nil {
			db.Exec("UPDATE threads SET downvotes = downvotes + 1, upvotes = upvotes - 1 WHERE id = ?", threadID)
			c.JSON(http.StatusOK, gin.H{"message": "Switched to downvote"})
			return
		}
	}

	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to downvote"})
}
