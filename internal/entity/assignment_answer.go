package entity

type AssignmentQuestionAnswer struct {
	Base
	QuestionId   int64          `json:"questionId"`
	Question     Question       `json:"question" gorm:"foreignKey:QuestionId"`
	AnswerId     int64          `json:"answerId"`
	Answer       QuestionChoice `json:"answer" gorm:"foreignKey:AnswerId"`
	AssignmentId int64          `json:"assignmentId"`
	Assignment   Assignment     `json:"assignment" gorm:"foreignKey:AssignmentId"`
}
