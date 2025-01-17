package handlers

import (
	"assignment-definitive/backend/handlers/user"
	"database/sql"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, db *sql.DB) {
	r.POST("/", func(c *gin.Context) { LoginHandler(c, db) })
	r.POST("/register", func(c *gin.Context) { RegisterHandler(c, db) })
	r.POST("/reset", func(c *gin.Context) { ResetHandler(c, db) })
	r.GET("/menu", func(c *gin.Context) { MenuHandler(c) })
	r.GET("/create", func(c *gin.Context) { CreateHandler(c) })
	r.GET("/username", user.UsernameHandler)
}
