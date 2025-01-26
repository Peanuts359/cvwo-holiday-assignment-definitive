package user_content

import (
	"database/sql"
	"github.com/Peanuts359/cvwo-holiday-assignment-definitive/backend/utils"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

func DeleteCommentHandler(c *gin.Context, db *sql.DB) {
	commentID := c.Param("comment_id")

	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing Authorization header"})
		return
	}
	username, err := utils.UsernameFromToken(strings.TrimPrefix(tokenString, "Bearer "))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	result, err := db.Exec("DELETE FROM comments WHERE id = ? AND username = ?", commentID, username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete comment"})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only delete your own comments"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Comment deleted successfully"})
}
