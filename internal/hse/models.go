package hse

import (
	"github.com/truc9/goal/internal/entity"
	"github.com/truc9/goal/internal/shared/model"
)

type AssessmentModel struct {
	model.BaseModel
	Id          int64  `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type AssignmentModel struct {
	UserId    int64 `json:"userId"`
	VersionId int64 `json:"versionId"`
}

type AssessmentVersionModel struct {
	Id            int64 `json:"id"`
	Version       int   `json:"version"`
	QuestionCount int   `json:"questionCount"`
}

type ChoiceModel struct {
	Id                int64  `json:"id"`
	Description       string `json:"description"`
	TriggerQuestionId int64  `json:"triggerQuestionId"`
}

type QuestionModel struct {
	Id                  int64               `json:"id"`
	Ordinal             int64               `json:"ordinal"`
	Description         string              `json:"description"`
	Type                entity.QuestionType `json:"type"`
	TypeName            string              `json:"typeName"`
	Choices             []ChoiceModel       `json:"choices"`
	AssessmentVersionId int64               `json:"assessmentVersionId"`
	Version             int                 `json:"version"`
}

type UpdateOrdinalModel struct {
	DestinationQuestionId int64 `json:"destinationQuestionId"`
}
