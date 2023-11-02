package controller

import (
	"encoding/csv"
	"fmt"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/truc9/goal/internal/hrm"
	"github.com/truc9/goal/internal/utils/httpcontext"
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
		return c.JSON(http.StatusBadRequest, err)
	}
	return c.JSON(http.StatusOK, nil)
}

// Get get my assignments
//
//	@Summary		Get my assignments
//	@Tags			Employees
//	@Success		200	{array}	hrm.AssessmentAssignmentModel
//	@Router			/api/employees/my-assignments [GET]
func (ct EmployeeController) GetMyAssignments(c echo.Context) error {
	userId := httpcontext.CurrentUserId(c)
	assessments, err := ct.employeeSv.GetAssessments(userId)
	if err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}
	return c.JSON(http.StatusOK, assessments)
}

func (ct EmployeeController) Deactivate(c echo.Context) error {
	userId := params.GetIntParam(c, "userId")
	res, err := ct.employeeSv.DeactivateUser(userId)
	if err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}
	return c.JSON(http.StatusOK, res)
}

func (ct EmployeeController) Activate(c echo.Context) error {
	userId := params.GetIntParam(c, "userId")
	res, err := ct.employeeSv.ActivateUser(userId)
	if err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}
	return c.JSON(http.StatusOK, res)
}

func (ct EmployeeController) Import(c echo.Context) error {
	formFile, err := c.FormFile("file")
	if err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	arr := strings.Split(formFile.Filename, ".")
	if arr[1] != "csv" {
		return c.JSON(http.StatusBadRequest, "Not supported file type. Please use .csv file.")
	}

	f, err := formFile.Open()
	if err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}
	defer f.Close()

	csvReader := csv.NewReader(f)
	data, err := csvReader.ReadAll()
	if err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	for index, row := range data {
		if index == 0 {
			continue
		}

		err := ct.employeeSv.Create(hrm.EmployeeCreateModel{
			FirstName: row[0],
			LastName:  row[1],
			Email:     row[2],
		})

		if err != nil {
			return c.JSON(http.StatusBadRequest, fmt.Errorf("import %v %v %v failed due to %s", row[0], row[1], row[2], err.Error()))
		}
	}

	return c.JSON(http.StatusOK, nil)
}
