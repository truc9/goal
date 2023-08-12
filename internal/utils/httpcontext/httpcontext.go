package httpcontext

import (
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func GetContextUserId(c echo.Context) (id uuid.UUID) {
	token := c.Get("user").(*jwt.Token)
	claims, _ := token.Claims.(jwt.MapClaims)
	userId := claims["jti"].(string)
	res, _ := uuid.Parse(userId)
	return res
}
