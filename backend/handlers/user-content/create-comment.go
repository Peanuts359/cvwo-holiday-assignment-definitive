package user_content

import (
	"database/sql"
	"github.com/Peanuts359/cvwo-assignment-definitive/backend/utils"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

func CreateCommentHandler(c *gin.Context, db *sql.DB) {
	threadID := c.Param("thread_id")

	var req struct {
		Content string `json:"content"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
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

	if req.Content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Comment cannot be empty"})
		return
	}

	query := "INSERT INTO comments (thread_id, username, content) VALUES (?, ?, ?)"
	_, err = db.Exec(query, threadID, username, req.Content)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comment"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Comment created successfully"})
}
