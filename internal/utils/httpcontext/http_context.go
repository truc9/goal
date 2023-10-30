package httpcontext

import (
	"strconv"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

func CurrentUserId(c echo.Context) (id int64) {
	token := c.Get("user").(*jwt.Token)
	claims, _ := token.Claims.(jwt.MapClaims)
	userId := claims["jti"].(string)
	result, _ := strconv.ParseInt(userId, 10, 64)
	return result
}

func CurrentRole(c echo.Context) string {
	token := c.Get("user").(*jwt.Token)
	claims, _ := token.Claims.(jwt.MapClaims)
	role := claims["role"].(string)
	return role
}
