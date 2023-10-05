package hse

type AssessmentModel struct {
	Id          int64  `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type AssessmentVersionModel struct {
	Id      int64 `json:"id"`
	Version int   `json:"version"`
}
