package controller

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/truc9/goal/internal/users/infra"
)

type UsersController struct {
	userService *infra.UserService
}

func ProvideUserController() *UsersController {
	return &UsersController{}
}

func (ctrl UsersController) GetAll(c echo.Context) (err error) {
	result := ctrl.userService.GetAll()
	return c.JSON(http.StatusOK, result)
}
