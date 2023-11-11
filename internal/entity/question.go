package entity

import "errors"

type QuestionType int

const (
	FreeText QuestionType = iota
	YesNo
	YesNoNa
	Confirmation
	Photo
	SingleChoice
	MultipleChoice
)

type Question struct {
	Base
	Ordinal             int64             `json:"ordinal"`
	Description         string            `json:"description"`
	QuestionType        QuestionType      `json:"questionType"`
	AssessmentVersionId int64             `json:"assessmentVersionId"`
	AssessmentVersion   AssessmentVersion `gorm:"foreignKey:AssessmentVersionId" json:"assessmentVersion"`
	Choices             []QuestionChoice  `json:"choices"`
}

func NewQuestion(description string, questionType QuestionType, assessmentVersionId, ordinal int64) Question {
	return Question{
		Description:         description,
		QuestionType:        questionType,
		Ordinal:             ordinal,
		AssessmentVersionId: assessmentVersionId,
		Choices:             make([]QuestionChoice, 0),
	}
}

func NewQuestionWithOrdinal(description string, questionType QuestionType, assessmentVersionId int64, ordinal int64) *Question {
	return &Question{
		Description:         description,
		QuestionType:        questionType,
		AssessmentVersionId: assessmentVersionId,
		Choices:             make([]QuestionChoice, 0),
		Ordinal:             ordinal,
	}
}

func (q *Question) AddChoice(description string, triggerQuestionId int64) {
	q.Choices = append(q.Choices, QuestionChoice{
		QuestionId:        q.Id,
		Description:       description,
		TriggerQuestionId: triggerQuestionId,
	})
}

func (q *Question) SetOrdinal(ordinal int64) error {
	if ordinal == 0 {
		return errors.New("ordinal is invalid")
	}
	q.Ordinal = ordinal
	return nil
}

func (q *Question) SwapOrdinal(target *Question) {
	tempOrdinal := q.Ordinal
	q.Ordinal = target.Ordinal
	target.Ordinal = tempOrdinal
}
