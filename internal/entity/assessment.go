package entity

import (
	"errors"
)

type Assessment struct {
	Base
	Name          string `json:"name"`
	Description   string `json:"description"`
	CreatedBy     int    `json:"createdBy"`
	CreatedByUser User   `gorm:"foreignKey:CreatedBy"`
	UpdatedBy     int    `json:"updatedBy"`
	UpdatedByUser User   `gorm:"foreignKey:UpdatedBy"`
}

func NewAssessment(userID int, name, description string) (*Assessment, error) {
	if len(name) == 0 {
		return nil, errors.New("name is mandatory")
	}

	return &Assessment{
		Name:        name,
		Description: description,
		CreatedBy:   userID,
	}, nil
}
