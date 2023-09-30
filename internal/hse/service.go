package hse

import (
	"github.com/google/uuid"
	"github.com/samber/lo"
	"github.com/truc9/goal/internal/hse/core"
	"gorm.io/gorm"
)

type AssessmentService struct {
	db *gorm.DB
}

func NewAssessmentService(db *gorm.DB) AssessmentService {
	return AssessmentService{
		db: db,
	}
}

func (sv AssessmentService) CreateAssessment(model *AssessmentModel) (uuid.UUID, error) {
	assessment, err := core.NewAssessment(model.Name, model.Description)
	if err != nil {
		return uuid.Nil, err
	}

	res := sv.db.Create(assessment)
	if res.Error != nil {
		return uuid.Nil, res.Error
	}
	return assessment.Id, nil
}

func (sv AssessmentService) GetAssessments() ([]AssessmentModel, error) {
	var entities []core.Assessment
	res := sv.db.Find(&entities)
	if res.Error != nil {
		return nil, res.Error
	}

	assessments := lo.Map(entities, func(item core.Assessment, index int) AssessmentModel {
		return AssessmentModel{
			Id:          item.Id,
			Name:        item.Name,
			Description: item.Description,
		}
	})

	return assessments, nil
}
