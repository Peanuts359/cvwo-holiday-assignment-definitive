package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func MenuHandler(c *gin.Context) {
	username := c.GetHeader("Username")
	if username == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"username": username})
}