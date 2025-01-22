package user_content

import (
	"assignment-definitive/backend/utils"
	"database/sql"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

type Thread struct {
	ID       int     `json:"id"`
	Username string  `json:"username"`
	Title    string  `json:"title"`
	Content  string  `json:"content"`
	Tags     *string `json:"tags"`
}

func CreateThreadHandler(c *gin.Context, db *sql.DB) {
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

	var thread Thread
	if err := c.ShouldBindJSON(&thread); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if thread.Title == "" || thread.Content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title and content cannot be empty"})
		return
	}

	tags := ""
	if thread.Tags != nil {
		tags = *thread.Tags
	}

	query := "INSERT INTO threads (username, title, content, tags) VALUES (?, ?, ?, ?)"
	_, err = db.Exec(query, username, thread.Title, thread.Content, tags)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create thread"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Thread created successfully"})
}
