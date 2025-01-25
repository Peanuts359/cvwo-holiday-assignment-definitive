package utils

import (
	"database/sql"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"strings"
	"time"
)

var jwtSecret = []byte("6bb186**********************f4a4bc")

func GenerateJWT(username string) (string, error) {
	claims := jwt.MapClaims{
		"username": username,
		"exp":      time.Now().Add(time.Hour * 1).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func ValidateJWT(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return nil, errors.New("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("invalid claims")
	}

	return claims, nil
}

func UsernameFromToken(tokenString string) (string, error) {
	claims, err := ValidateJWT(tokenString)
	if err != nil {
		return "", err
	}

	username, ok := claims["username"].(string)
	if !ok {
		return "", errors.New("username not found in token")
	}

	return username, nil
}

func GetUserIDFromToken(c *gin.Context, db *sql.DB) (int, error) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		return 0, errors.New("missing Authorization header")
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	username, err := UsernameFromToken(tokenString)
	if err != nil {
		return 0, fmt.Errorf("failed to extract username from token: %w", err)
	}
	
	var userID int
	query := "SELECT id FROM users WHERE username = ?"
	err = db.QueryRow(query, username).Scan(&userID)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, errors.New("user not found")
		}
		return 0, fmt.Errorf("database error: %w", err)
	}

	return userID, nil
}
