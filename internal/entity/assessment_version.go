package entity

type AssessmentVersion struct {
	Base
	Version      int        `json:"version"`
	AssessmentId int        `json:"assessmentId"`
	Assessment   Assessment `json:"assessment" gorm:"foreignKey:AssessmentId"`
}
