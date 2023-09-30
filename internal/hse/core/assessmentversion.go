package core

import "github.com/google/uuid"

type AssessmentVersion struct {
	Id           uuid.UUID `gorm:"primaryKey" json:"id"`
	Version      int       `json:"version"`
	AssessmentId uuid.UUID `json:"assessmentId"`
}
