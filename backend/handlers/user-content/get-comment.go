package user_content

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetCommentsHandler(c *gin.Context, db *sql.DB) {
	var comment struct {
		ID       int    `json:"comment_id"`
		Username string `json:"username"`
		Content  string `json:"content"`
	}

	threadID := c.Param("thread_id")

	rows, err := db.Query("SELECT id, username, content FROM comments WHERE thread_id = ?", threadID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch comments"})
		return
	}
	defer rows.Close()

	var comments []struct {
		ID       int    `json:"comment_id"`
		Username string `json:"username"`
		Content  string `json:"content"`
	}

	for rows.Next() {

		if err := rows.Scan(&comment.ID, &comment.Username, &comment.Content); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse comments"})
			return
		}
		comments = append(comments, comment)
	}

	c.JSON(http.StatusOK, comments)
}
