package entity

type AssessmentVersion struct {
	Base
	Version      int        `json:"version"`
	AssessmentId int64      `json:"assessmentId"`
	Assessment   Assessment `json:"assessment" gorm:"foreignKey:AssessmentId"`
	Questions    []Question `json:"questions"`
}

func (v *AssessmentVersion) AddQuestion(q Question) []Question {
	return v.Questions
}

func (v *AssessmentVersion) RemoveQuestion(questionId int64) []Question {
	return v.Questions
}

func (v *AssessmentVersion) OrderQuestions() []Question {
	return v.Questions
}
