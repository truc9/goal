package model

import "github.com/google/uuid"

type (
	Register struct {
		FirstName string `json:"firstName"`
		LastName  string `json:"lastName"`
		Email     string `json:"email"`
		Password  string `json:"password"`
	}

	Login struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	RoleAssignment struct {
		RoleId uuid.UUID `json:"roleId"`
	}
)
