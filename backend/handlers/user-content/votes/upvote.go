package votes

import (
	"assignment-definitive/backend/utils"
	"database/sql"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

func UpvoteThreadHandler(c *gin.Context, db *sql.DB) {
	threadID := c.Param("thread_id")
	if threadID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Thread ID is required"})
		return
	}

	userID, err := utils.GetUserIDFromToken(c, db)
	if err != nil {
		log.Println("Error extracting user ID:", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	var existingVote string
	err = db.QueryRow("SELECT vote_type FROM user_votes WHERE user_id = ? AND thread_id = ?", userID, threadID).Scan(&existingVote)
	if err != nil && err != sql.ErrNoRows {
		log.Println("Error checking existing vote:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process vote"})
		return
	}

	tx, err := db.Begin()
	if err != nil {
		log.Println("Error starting transaction:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if err == sql.ErrNoRows {
		_, err = tx.Exec("INSERT INTO user_votes (user_id, thread_id, vote_type) VALUES (?, ?, 'upvote')", userID, threadID)
		if err == nil {
			_, err = tx.Exec("UPDATE threads SET upvotes = upvotes + 1 WHERE id = ?", threadID)
		}
	} else if existingVote == "upvote" {
		_, err = tx.Exec("DELETE FROM user_votes WHERE user_id = ? AND thread_id = ?", userID, threadID)
		if err == nil {
			_, err = tx.Exec("UPDATE threads SET upvotes = upvotes - 1 WHERE id = ?", threadID)
		}
	} else if existingVote == "downvote" {
		_, err = tx.Exec("UPDATE user_votes SET vote_type = 'upvote' WHERE user_id = ? AND thread_id = ?", userID, threadID)
		if err == nil {
			_, err = tx.Exec("UPDATE threads SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = ?", threadID)
		}
	}

	if err != nil {
		tx.Rollback()
		log.Println("Error updating votes:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process vote"})
		return
	}

	err = tx.Commit()
	if err != nil {
		log.Println("Error committing transaction:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Vote processed successfully"})
}
