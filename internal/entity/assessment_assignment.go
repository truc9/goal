package entity

type AssessmentAssignment struct {
	Base
	UserId              int64             `json:"userId"`
	User                User              `json:"user" gorm:"foreignKey:UserId"`
	AssessmentVersionId int64             `json:"assessmentVersionId"`
	AssessmentVersion   AssessmentVersion `json:"assessmentVersion" gorm:"foreignKey:AssessmentVersionId"`
	Score               int64             `json:"score"`
	IsDone              bool              `json:"isDone"`
	Comment             string            `json:"comment"`
}
