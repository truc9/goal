package core

import "github.com/google/uuid"

type QuestionType int

const (
	FreeText QuestionType = iota
	YesNo
	YesNoNa
	Confirmation
	Photo
	Selection
	SingleChoice
	MultipleChoice
)

type Question struct {
	Id                  uuid.UUID    `gorm:"primaryKey" json:"id"`
	Description         string       `json:"description"`
	QuestionType        QuestionType `json:"questionType"`
	AssessmentVersionId uuid.UUID    `json:"assessmentVersionId"`
}
