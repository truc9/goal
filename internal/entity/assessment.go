package entity

import (
	"errors"
	"time"

	"github.com/google/uuid"
)

type Assessment struct {
	Id            uuid.UUID `gorm:"type:uuid;primary_key;" json:"id"`
	Name          string    `json:"name"`
	Description   string    `json:"description"`
	CreatedBy     uuid.UUID `json:"createdBy"`
	CreatedDate   time.Time `json:"createdDate"`
	CreatedByUser User      `gorm:"foreignKey:CreatedBy"`
	UpdatedBy     uuid.UUID `json:"updatedBy"`
	UpdatedByUser User      `gorm:"foreignKey:UpdatedBy"`
}

func NewAssessment(currentUser uuid.UUID, name, description string) (*Assessment, error) {
	if len(name) == 0 {
		return nil, errors.New("name is mandatory")
	}

	return &Assessment{
		Id:          uuid.New(),
		Name:        name,
		Description: description,
		CreatedBy:   currentUser,
	}, nil
}
