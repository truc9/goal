package entity

import (
	"errors"
	"fmt"
)

type Assessment struct {
	Base
	Name          string `json:"name"`
	Description   string `json:"description"`
	CreatedBy     int64  `json:"createdBy"`
	CreatedByUser User   `gorm:"foreignKey:CreatedBy"`
	UpdatedBy     int64  `gorm:"default:null" json:"updatedBy"`
	UpdatedByUser User   `gorm:"foreignKey:UpdatedBy"`
}

func NewAssessment(userID int64, name, description string) (*Assessment, error) {
	if len(name) == 0 {
		return nil, errors.New("name is mandatory")
	}

	return &Assessment{
		Name:        name,
		Description: description,
		CreatedBy:   userID,
	}, nil
}

func (a *Assessment) Update(name, description string, updatedBy int64) error {
	if len(name) == 0 {
		return fmt.Errorf("name must be provided")
	}

	if len(description) == 0 {
		return fmt.Errorf("description must be provided")
	}

	if updatedBy == 0 {
		return fmt.Errorf("updated by user is invalid")
	}

	a.Name = name
	a.Description = description
	a.UpdatedBy = updatedBy

	return nil
}
