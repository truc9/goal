package hse

import "github.com/truc9/goal/internal/entity"

type AssessmentModel struct {
	Id          int64  `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type AssessmentVersionModel struct {
	Id      int64 `json:"id"`
	Version int   `json:"version"`
}

type ChoiceModel struct {
	Id                int64  `json:"id"`
	Description       string `json:"description"`
	TriggerQuestionId int64  `json:"triggerQuestionId"`
}

type QuestionModel struct {
	Id                  int64               `json:"id"`
	Description         string              `json:"description"`
	Type                entity.QuestionType `json:"type"`
	TypeName            string              `json:"typeName"`
	Choices             []ChoiceModel       `json:"choices"`
	AssessmentVersionId int64               `json:"assessmentVersionId"`
	Version             int                 `json:"version"`
}
