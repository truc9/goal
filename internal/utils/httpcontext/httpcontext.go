package httpcontext

import (
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func GetUserId(c echo.Context) (id uuid.UUID) {
	token := c.Get("user").(*jwt.Token)
	claims, _ := token.Claims.(jwt.MapClaims)
	userId := claims["jti"].(string)
	res, _ := uuid.Parse(userId)
	return res
}

func GetUserRole(c echo.Context) string {
	token := c.Get("user").(*jwt.Token)
	claims, _ := token.Claims.(jwt.MapClaims)
	role := claims["role"].(string)
	return role
}
