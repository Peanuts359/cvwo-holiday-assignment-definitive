package user_content

import (
	"database/sql"
	"github.com/Peanuts359/cvwo-holiday-assignment-definitive/backend/utils"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

func GetThreadsHandler(c *gin.Context, db *sql.DB) {
	var err error

	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing Authorization header"})
		return
	}
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	username, err := utils.UsernameFromToken(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	var userID int
	err = db.QueryRow("SELECT id FROM users WHERE username = ?", username).Scan(&userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User not found"})
		return
	}

	searchTag := c.Query("tag")
	var rows *sql.Rows

	if searchTag != "" {
		query := `
			SELECT 
				t.id, t.username, t.title, t.content, IFNULL(t.tags, ''), 
				t.upvotes, t.downvotes, (t.upvotes - t.downvotes) AS votes,
				uv.vote_type AS userVote
			FROM threads t
			LEFT JOIN user_votes uv 
				ON uv.thread_id = t.id AND uv.user_id = ?
			WHERE t.tags LIKE ?
		`
		rows, err = db.Query(query, userID, "%"+searchTag+"%")
	} else {
		query := `
			SELECT 
				t.id, t.username, t.title, t.content, IFNULL(t.tags, ''), 
				t.upvotes, t.downvotes, (t.upvotes - t.downvotes) AS votes,
				uv.vote_type AS userVote
			FROM threads t
			LEFT JOIN user_votes uv 
				ON uv.thread_id = t.id AND uv.user_id = ?
		`
		rows, err = db.Query(query, userID)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch threads"})
		return
	}

	defer rows.Close()

	var threads []Thread
	for rows.Next() {
		var thread Thread
		var userVote sql.NullString
		err = rows.Scan(
			&thread.ID, &thread.Username, &thread.Title, &thread.Content, &thread.Tags,
			&thread.Upvotes, &thread.Downvotes, &thread.Votes, &userVote,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse threads"})
			return
		}
		thread.UserVote = userVote.String
		if thread.UserVote == "" {
			thread.UserVote = "null"
		}
		threads = append(threads, thread)
	}

	c.JSON(http.StatusOK, threads)
}
