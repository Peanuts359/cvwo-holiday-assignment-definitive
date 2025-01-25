package votes

import (
	"assignment-definitive/backend/utils"
	"database/sql"
	"github.com/gin-gonic/gin"
	"net/http"
)

func DownvoteThreadHandler(c *gin.Context, db *sql.DB) {
	threadID := c.Param("id")

	userID, err := utils.GetUserIDFromToken(c, db)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
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
