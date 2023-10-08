package hrm

import (
	"github.com/truc9/goal/internal/shared/model"
)

type EmployeeModel struct {
	model.BaseModel
	FirstName      string `json:"firstName"`
	LastName       string `json:"lastName"`
	Email          string `json:"email"`
	EmployeeNumber string `json:"employeeNumber"`
}
