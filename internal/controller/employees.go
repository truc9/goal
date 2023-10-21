package controller

import (
	"encoding/csv"
	"log"
	"net/http"
	"strings"

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
	res, err := ct.employeeSv.DeactivateUser(userId)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.JSON(http.StatusOK, res)
}

func (ct EmployeeController) Activate(c echo.Context) error {
	userId := params.GetIntParam(c, "userId")
	res, err := ct.employeeSv.ActivateUser(userId)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
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

		ct.employeeSv.Create(hrm.EmployeeCreateModel{
			FirstName: row[0],
			LastName:  row[1],
			Email:     row[2],
		})

		log.Printf("imported %v %v %v\n", row[0], row[1], row[2])
	}

	return c.JSON(http.StatusOK, nil)
}
