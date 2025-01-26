package votes

import (
	"database/sql"
	"github.com/Peanuts359/cvwo-holiday-assignment-definitive/backend/utils"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"strings"
)

func UpvoteThreadHandler(c *gin.Context, db *sql.DB) {
	threadID := c.Param("thread_id")
	log.Println("upvoting thread: " + threadID)
	if threadID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Thread ID is required"})
		return
	}

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
		log.Println("newly upvoting thread: " + threadID)
		_, err := db.Exec("INSERT INTO user_votes (user_id, thread_id, vote_type) VALUES (?, ?, 'upvote')", userID, threadID)
		if err == nil {
			db.Exec("UPDATE threads SET upvotes = upvotes + 1 WHERE id = ?", threadID)
			c.JSON(http.StatusOK, gin.H{"message": "upvoted successfully"})
			return
		}
	} else if existingVote == "upvote" {
		log.Println("unupvoting thread: " + threadID)
		_, err := db.Exec("DELETE FROM user_votes WHERE user_id = ? AND thread_id = ?", userID, threadID)
		if err == nil {
			db.Exec("UPDATE threads SET upvotes = upvotes - 1 WHERE id = ?", threadID)
			c.JSON(http.StatusOK, gin.H{"message": "upvote removed"})
			return
		}
	} else if existingVote == "downvote" {
		log.Println("upvoting thread: " + threadID)
		_, err := db.Exec("UPDATE user_votes SET vote_type = 'upvote' WHERE user_id = ? AND thread_id = ?", userID, threadID)
		if err == nil {
			db.Exec("UPDATE threads SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = ?", threadID)
			c.JSON(http.StatusOK, gin.H{"message": "Switched to upvote"})
			return
		}
	}

	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upvote"})
}
