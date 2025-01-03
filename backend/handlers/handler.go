package handlers

import (
	"database/sql"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, db *sql.DB) {
	r.POST("/login", func(c *gin.Context) { LoginHandler(c, db) })
	r.POST("/signup", func(c *gin.Context) { RegisterHandler(c, db) })
	r.POST("/reset-password", func(c *gin.Context) { ResetHandler(c, db) })
}
