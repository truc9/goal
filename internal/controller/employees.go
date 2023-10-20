package controller

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/truc9/goal/internal/hrm"
	"github.com/truc9/goal/internal/utils/params"
)

type EmployeeController struct {
	employeeSv hrm.EmployeeService
}

func NewEmployeeController(employeeSv hrm.EmployeeService) EmployeeController {
	return EmployeeController{
		employeeSv: employeeSv,
	}
}

func (ct EmployeeController) GetAll(c echo.Context) (err error) {
	result, _ := ct.employeeSv.GetAll()
	return c.JSON(http.StatusOK, result)
}

func (ct EmployeeController) AllocEmployeeNumber(c echo.Context) error {
	userId := params.GetIntParam(c, "userId")
	err := ct.employeeSv.AllocEmployeeNumber(userId)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.JSON(http.StatusOK, nil)
}

func (ct EmployeeController) Deactivate(c echo.Context) error {
	userId := params.GetIntParam(c, "userId")
	err := ct.employeeSv.DeactivateUser(userId)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.JSON(http.StatusOK, nil)
}

func (ct EmployeeController) Activate(c echo.Context) error {
	userId := params.GetIntParam(c, "userId")
	err := ct.employeeSv.ActivateUser(userId)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.JSON(http.StatusOK, nil)
}
