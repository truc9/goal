package entity

type AssessmentVersion struct {
	Base
	Version      int        `json:"version"`
	AssessmentId int64      `json:"assessmentId"`
	Assessment   Assessment `json:"assessment" gorm:"foreignKey:AssessmentId"`
	Questions    []Question `json:"questions"`
}

func NewAssessmentVersion(version int, assessmentId int64) AssessmentVersion {
	return AssessmentVersion{
		Version:      version,
		AssessmentId: assessmentId,
	}
}

func (v *AssessmentVersion) AddQuestion(q Question) []Question {
	q.Ordinal = int64(len(v.Questions) + 1)
	v.Questions = append(v.Questions, q)
	return v.Questions
}

func (v *AssessmentVersion) RemoveQuestion(questionId int64) []Question {
	return v.Questions
}

func (v *AssessmentVersion) OrderQuestions() []Question {
	return v.Questions
}
