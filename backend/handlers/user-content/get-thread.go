package user_content

import (
	"assignment-definitive/backend/utils"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetThreadsHandler(c *gin.Context) {
	query := "SELECT id, username, title, content FROM threads ORDER BY id DESC"
	db := utils.GetDB()
	rows, err := db.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch threads"})
		return
	}
	defer rows.Close()

	var threads []Thread
	for rows.Next() {
		var thread Thread
		var id int
		err := rows.Scan(&id, &thread.Username, &thread.Title, &thread.Content)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse threads"})
			return
		}
		threads = append(threads, thread)
	}

	c.JSON(http.StatusOK, threads)
}
