package entity

type AssessmentVersion struct {
	Base
	Version      int         `json:"version"`
	AssessmentId int64       `json:"assessmentId"`
	Assessment   *Assessment `json:"assessment" gorm:"foreignKey:AssessmentId"`
}
