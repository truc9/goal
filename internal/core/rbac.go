package core

import (
	"errors"

	"github.com/google/uuid"
	"github.com/tnoss/goal/internal/core/enums"
)

type (
	Role struct {
		Id          uuid.UUID `gorm:"primaryKey" json:"id"`
		Type        int       `json:"code"`
		Name        string    `json:"name"`
		Description string    `json:"description"`
	}

	Policy struct {
		Id         uuid.UUID            `gorm:"primaryKey" json:"id"`
		Name       string               `json:"name"`
		Permission enums.PermissionType `json:"permission"`
		RoleId     uuid.UUID            `json:"roleId"`
		Role       Role                 `gorm:"foreignKey:RoleId" json:"role"`
	}
)

func CreateNewRole(roleType enums.RoleType, name, description string) (role *Role, err error) {
	if len(name) == 0 {
		return nil, errors.New("name is required")
	}

	var roleTypeId int = int(roleType)

	res := &Role{
		Id:          uuid.New(),
		Type:        roleTypeId,
		Name:        name,
		Description: description,
	}

	return res, nil
}
