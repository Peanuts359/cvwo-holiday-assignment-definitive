package user_content

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetThreadsHandler(c *gin.Context, db *sql.DB) {
	searchTag := c.Query("tag")
	var rows *sql.Rows
	var err error

	if searchTag != "" {
		query := "SELECT id, username, title, content, tags, upvotes, downvotes, (upvotes - downvotes) AS votes FROM threads WHERE tags LIKE ?"
		rows, err = db.Query(query, "%"+searchTag+"%")
	} else {
		query := "SELECT id, username, title, content, IFNULL(tags, ''), upvotes, downvotes, (upvotes - downvotes) AS votes FROM threads"
		rows, err = db.Query(query)
	}
	defer rows.Close()

	var threads []Thread
	for rows.Next() {
		var thread Thread
		err = rows.Scan(&thread.ID, &thread.Username, &thread.Title, &thread.Content, &thread.Tags, &thread.Upvotes, &thread.Downvotes, &thread.Votes)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse threads"})
			return
		}
		threads = append(threads, thread)
	}

	c.JSON(http.StatusOK, threads)
}
