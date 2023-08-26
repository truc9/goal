package controller

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/truc9/goal/internal/iam"
)

type IamController struct {
	s iam.IamService
}

func NewIamController(s iam.IamService) IamController {
	return IamController{
		s: s,
	}
}

func (h IamController) RegisterUser(c echo.Context) (err error) {
	r := &iam.RegisterModel{}
	if err = c.Bind(r); err != nil {
		return
	}

	user, err := h.s.RegisterUser(r)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, user)
}

func (h IamController) Login(c echo.Context) (err error) {
	req := iam.LoginModel{}
	if err = c.Bind(&req); err != nil {
		return
	}

	result, err := h.s.Login(req)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, result)
}

func (h IamController) AssignRole(c echo.Context) (err error) {
	userId, _ := uuid.Parse(c.Param("userId"))
	model := iam.RoleAssignmentModel{}
	if err := c.Bind(&model); err != nil {
		return c.JSON(http.StatusBadRequest, "Unable to process the request")
	}

	h.s.AssignRole(userId, model)

	return c.JSON(http.StatusOK, nil)
}
