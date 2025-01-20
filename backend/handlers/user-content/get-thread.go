package user_content

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetThreadsHandler(c *gin.Context, db *sql.DB) {
	query := "SELECT id, username, title, content FROM threads ORDER BY id DESC"
	rows, err := db.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch threads"})
		return
	}
	defer rows.Close()

	var threads []Thread
	for rows.Next() {
		var thread Thread
		err := rows.Scan(&thread.ID, &thread.Username, &thread.Title, &thread.Content)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse threads"})
			return
		}
		threads = append(threads, thread)
	}

	c.JSON(http.StatusOK, threads)
}
