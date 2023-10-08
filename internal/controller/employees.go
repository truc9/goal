package controller

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/truc9/goal/internal/hrm"
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
