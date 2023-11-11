package entity

type QuestionAnswer struct {
	Base
	QuestionId             int64
	Question               Question `gorm:"foreignKey:QuestionId"`
	AnswerId               int64
	Answer                 QuestionChoice `gorm:"foreignKey:AnswerId"`
	AssessmentSubmissionId int64
	AssessmentSubmission   AssessmentSubmission `gorm:"foreignKey:AssessmentSubmissionId"`
}
