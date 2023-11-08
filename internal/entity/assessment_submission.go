package entity

type AssessmentSubmission struct {
	Base
	AssessmentVersionId int64
	SubmittedById       int64
	SubmittedBy         User `gorm:"foreignKey:SubmittedById"`
	Score               int64
}
