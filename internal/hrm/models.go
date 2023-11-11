package hrm

import (
	"time"

	"github.com/google/uuid"
)

type (
	EmployeeModel struct {
		Id             int64     `json:"id"`
		Uid            uuid.UUID `json:"uid"`
		UpdatedBy      int64     `json:"updatedBy"`
		CreatedBy      int64     `json:"createdBy"`
		CreatedDate    time.Time `json:"createdDate"`
		UpdatedDate    time.Time `json:"updatedDate"`
		IsActive       bool      `json:"isActive"`
		FirstName      string    `json:"firstName"`
		LastName       string    `json:"lastName"`
		Email          string    `json:"email"`
		EmployeeNumber string    `json:"employeeNumber"`
	}

	EmployeeResponse struct {
		Id        int64  `json:"id"`
		FirstName string `json:"firstName"`
		LastName  string `json:"lastName"`
	}

	EmployeeCreateModel struct {
		FirstName string `json:"firstName"`
		LastName  string `json:"lastName"`
		Email     string `json:"email"`
	}

	AssessmentAssignmentModel struct {
		AssignmentId   int64  `json:"assignmentId"`
		AssessmentId   int64  `json:"assessmentId"`
		AssessmentName string `json:"assessmentName"`
		Description    string `json:"description"`
		VersionId      int64  `json:"versionId"`
		Version        int64  `json:"version"`
		IsDone         bool   `json:"isDone"`
	}
)
