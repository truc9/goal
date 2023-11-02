package controller

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/truc9/goal/internal/iam"
)

type IamController struct {
	iamSv iam.IamService
}

func NewIamController(iamSv iam.IamService) IamController {
	return IamController{
		iamSv: iamSv,
	}
}

func (ctrl IamController) RegisterUser(c echo.Context) (err error) {
	r := &iam.RegisterModel{}
	if err = c.Bind(r); err != nil {
		return
	}

	user, err := ctrl.iamSv.RegisterUser(r)

	if err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	return c.JSON(http.StatusOK, user)
}

func (ctrl IamController) Login(c echo.Context) (err error) {
	req := iam.LoginModel{}
	if err = c.Bind(&req); err != nil {
		return
	}

	result, err := ctrl.iamSv.Login(req)
	if err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	return c.JSON(http.StatusOK, result)
}

func (ctrl IamController) AssignRole(c echo.Context) (err error) {
	userId, _ := strconv.Atoi(c.Param("userId"))
	model := iam.RoleAssignmentModel{}
	if err := c.Bind(&model); err != nil {
		return c.JSON(http.StatusBadRequest, "Unable to process the request")
	}

	ctrl.iamSv.AssignRole(userId, model)

	return c.JSON(http.StatusOK, nil)
}
