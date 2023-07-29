package handler

import (
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"github.com/tnoss/goal/internal/constants"
	"github.com/tnoss/goal/internal/dto"
	"github.com/tnoss/goal/internal/model"
)

type (
	jwtClaims struct {
		Name  string `json:"name"`
		Email string `json:"email"`
		jwt.RegisteredClaims
	}
)

func (h *Handler) RegisterUser(c echo.Context) (err error) {
	r := &dto.Register{}
	if err = c.Bind(r); err != nil {
		return
	}

	user := model.CreateUser(r.FirstName, r.LastName, r.Email)
	user.SetPassword(r.Password)

	res := h.Db.Create(&user)

	if res.Error != nil {
		return
	}

	return c.JSON(http.StatusOK, user)
}

func (h *Handler) Login(c echo.Context) (err error) {
	req := dto.Login{}
	if err = c.Bind(&req); err != nil {
		return
	}

	user := model.User{}
	res := h.Db.First(&user, "email=?", req.Email)

	if res.Error != nil {
		return c.JSON(http.StatusUnauthorized, "User does not exist")
	}

	if !user.VerifyPassword(req.Password) {
		return c.JSON(http.StatusUnauthorized, "Invalid password")
	}

	claims := &jwtClaims{
		fmt.Sprintf("%s %s", user.FirstName, user.LastName),
		user.Email,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute * 15)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err := token.SignedString([]byte(constants.Secret))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, echo.Map{
		"email": user.Email,
		"name":  fmt.Sprintf("%s %s", user.FirstName, user.LastName),
		"token": signedToken,
	})
}
