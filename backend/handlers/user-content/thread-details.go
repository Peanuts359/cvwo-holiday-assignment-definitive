package user_content

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetThreadDetailsHandler(c *gin.Context, db *sql.DB) {
	threadID := c.Param("thread_id")

	var thread struct {
		ID       int    `json:"thread_id"`
		Username string `json:"username"`
		Title    string `json:"title"`
		Content  string `json:"content"`
		Tags     string `json:"tags"` // Comma-separated tags
	}

	err := db.QueryRow("SELECT id, username, title, content, tags FROM threads WHERE id = ?", threadID).
		Scan(&thread.ID, &thread.Username, &thread.Title, &thread.Content, &thread.Tags)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Thread not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch thread details"})
		return
	}

	c.JSON(http.StatusOK, thread)
}
