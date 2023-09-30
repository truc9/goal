package hse

import "github.com/google/uuid"

type AssessmentModel struct {
	Id          uuid.UUID
	Name        string `json:"name"`
	Description string `json:"description"`
}
