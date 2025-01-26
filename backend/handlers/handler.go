package handlers

import (
	"database/sql"
	"github.com/Peanuts359/cvwo-assignment-definitive/backend/handlers/user-content"
	"github.com/Peanuts359/cvwo-assignment-definitive/backend/handlers/user-content/votes"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, db *sql.DB) {
	r.POST("/", func(c *gin.Context) { LoginHandler(c, db) })
	r.POST("/register", func(c *gin.Context) { RegisterHandler(c, db) })
	r.POST("/reset", func(c *gin.Context) { ResetHandler(c, db) })
	r.GET("/menu", func(c *gin.Context) { MenuHandler(c) })
	r.GET("/create", func(c *gin.Context) { CreateHandler(c) })
	r.GET("/username", user_content.UsernameHandler)

	r.POST("/create-thread", func(c *gin.Context) { user_content.CreateThreadHandler(c, db) })
	r.GET("/threads", func(c *gin.Context) { user_content.GetThreadsHandler(c, db) })
	r.DELETE("/threads/:thread_id", func(c *gin.Context) { user_content.DeleteThreadHandler(c, db) })
	r.PUT("/threads/:thread_id", func(c *gin.Context) { user_content.EditThreadHandler(c, db) })

	r.POST("/threads/:thread_id/comments", func(c *gin.Context) { user_content.CreateCommentHandler(c, db) })
	r.GET("/threads/:thread_id/comments", func(c *gin.Context) { user_content.GetCommentsHandler(c, db) })
	r.PUT("/threads/:thread_id/comments/:comment_id", func(c *gin.Context) { user_content.EditCommentHandler(c, db) })
	r.DELETE("/threads/:thread_id/comments/:comment_id", func(c *gin.Context) { user_content.DeleteCommentHandler(c, db) })
	r.GET("/threads/:thread_id", func(c *gin.Context) { user_content.GetThreadDetailsHandler(c, db) })

	r.POST("/threads/:thread_id/upvote", func(c *gin.Context) { votes.UpvoteThreadHandler(c, db) })
	r.POST("/threads/:thread_id/downvote", func(c *gin.Context) { votes.DownvoteThreadHandler(c, db) })
}
