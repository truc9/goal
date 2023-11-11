package entity

type QuestionChoice struct {
	Base
	Description       string   `json:"description"`
	QuestionId        int64    `json:"questionId"`
	Question          Question `gorm:"foreignKey:QuestionId" json:"question"`
	TriggerQuestionId int64    `json:"triggerQuestionId"`
	Score             int64    `json:"score"`
}
