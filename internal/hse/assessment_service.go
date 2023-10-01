package hse

import (
	"github.com/samber/lo"
	"github.com/truc9/goal/internal/entity"
	"gorm.io/gorm"
)

type AssessmentService struct {
	tx *gorm.DB
}

func NewAssessmentService(tx *gorm.DB) AssessmentService {
	return AssessmentService{
		tx: tx,
	}
}

func (sv AssessmentService) CreateAssessment(userID int64, model *AssessmentModel) (int64, error) {
	assessment, err := entity.NewAssessment(userID, model.Name, model.Description)
	if err != nil {
		return 0, err
	}

	res := sv.tx.Debug().Create(assessment)

	if res.Error != nil {
		return 0, res.Error
	}

	return assessment.Id, nil
}

func (sv AssessmentService) GetAssessments() ([]AssessmentModel, error) {
	var entities []entity.Assessment
	res := sv.tx.Debug().Find(&entities)
	if res.Error != nil {
		return nil, res.Error
	}

	assessments := lo.Map(entities, func(item entity.Assessment, index int) AssessmentModel {
		return AssessmentModel{
			Id:          item.Id,
			Name:        item.Name,
			Description: item.Description,
		}
	})

	return assessments, nil
}
