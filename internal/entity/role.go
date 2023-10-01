package entity

import (
	"errors"
)

type Role struct {
	Id          int    `gorm:"primaryKey" json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

func CreateNewRole(roleTypeId RoleTypeId, name, description string) (role *Role, err error) {
	if len(name) == 0 {
		return nil, errors.New("name is required")
	}

	res := &Role{
		Id:          int(roleTypeId),
		Name:        name,
		Description: description,
	}

	return res, nil
}
