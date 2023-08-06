package handler

import (
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"github.com/tnoss/goal/internal/constants"
	"github.com/tnoss/goal/internal/core"
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
	r := &model.Register{}
	if err = c.Bind(r); err != nil {
		return
	}

	user := core.CreateUser(r.FirstName, r.LastName, r.Email)
	user.SetPassword(r.Password)

	res := h.DB.Create(&user)

	if res.Error != nil {
		return
	}

	return c.JSON(http.StatusOK, user)
}

func (h *Handler) Login(c echo.Context) (err error) {
	req := model.Login{}
	if err = c.Bind(&req); err != nil {
		return
	}

	user := core.User{}
	res := h.DB.First(&user, "email=?", req.Email)

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
			ID:        user.Id.String(),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 8)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err := token.SignedString([]byte(constants.Secret))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, echo.Map{
		"id":    user.Id,
		"email": user.Email,
		"name":  fmt.Sprintf("%s %s", user.FirstName, user.LastName),
		"token": signedToken,
	})
}

func (h *Handler) AssignRole(c echo.Context) (err error) {
	userId := c.Param("userId")
	model := model.RoleAssignment{}
	if err := c.Bind(&model); err != nil {
		return c.JSON(http.StatusBadRequest, "Unable to process the request")
	}

	user := core.User{}
	if res := h.DB.Find(&user, userId); res.RowsAffected == 0 {
		return c.JSON(http.StatusNotFound, "User not found")
	}

	role := core.Role{}
	if res := h.DB.Find(&role, model.RoleId); res.RowsAffected == 0 {
		return c.JSON(http.StatusNotFound, "Role not found")
	}

	user.UpdateRole(model.RoleId)

	h.DB.Save(&user)

	return c.JSON(http.StatusOK, nil)
}
