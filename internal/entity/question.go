package entity

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
	Base
	Description         string       `json:"description"`
	QuestionType        QuestionType `json:"questionType"`
	AssessmentVersionId int          `json:"assessmentVersionId"`
}
