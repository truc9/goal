package entity

type AssignmentStatus int

const (
	DraftAssignment     AssignmentStatus = 1
	SubmittedAssignment AssignmentStatus = 2
)

type Assignment struct {
	Base
	UserId              int64             `json:"userId"`
	User                User              `json:"user" gorm:"foreignKey:UserId"`
	SubmittedById       int64             `json:"submittedById"`
	SubmittedBy         User              `json:"submittedBy" gorm:"foreignKey:SubmittedById"`
	AssessmentVersionId int64             `json:"assessmentVersionId"`
	AssessmentVersion   AssessmentVersion `json:"assessmentVersion" gorm:"foreignKey:AssessmentVersionId"`
	Score               int64             `json:"score"`
	Status              AssignmentStatus  `json:"status"`
	Comment             string            `json:"comment"`
}
