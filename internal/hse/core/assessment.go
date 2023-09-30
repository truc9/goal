package core

import (
	"errors"

	"github.com/google/uuid"
	"github.com/truc9/goal/internal/iam"
)

type Assessment struct {
	Id            uuid.UUID `gorm:"primaryKey" json:"id"`
	Name          string    `json:"name"`
	Description   string    `json:"description"`
	CreatedBy     uuid.UUID `json:"createdBy"`
	CreatedByUser iam.User  `gorm:"foreignKey:CreatedBy"`
	UpdatedBy     uuid.UUID `json:"updatedBy"`
	UpdatedByUser iam.User  `gorm:"foreignKey:UpdatedBy"`
}

func NewAssessment(name, description string) (*Assessment, error) {
	if len(name) == 0 {
		return nil, errors.New("name is mandatory")
	}

	return &Assessment{
		Id:          uuid.New(),
		Name:        name,
		Description: description,
	}, nil
}
