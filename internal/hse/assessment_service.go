package hse

import (
	"errors"

	"github.com/samber/lo"
	"github.com/truc9/goal/internal/entity"
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

func (sv AssessmentService) CreateAssessment(userID int64, model *AssessmentModel) (int64, error) {
	var result int64
	err := sv.db.Transaction(func(tx *gorm.DB) error {
		assessment, err := entity.NewAssessment(userID, model.Name, model.Description)
		if err != nil {
			return err
		}

		res := tx.Debug().Create(assessment)

		if res.Error != nil {
			return res.Error
		}

		version := &entity.AssessmentVersion{}
		versionRes := sv.db.Where("version = ? AND assessment_id = ?", 1, assessment.Id).First(version)

		if errors.Is(versionRes.Error, gorm.ErrRecordNotFound) {
			// If version not exist, create 1st version
			version := &entity.AssessmentVersion{
				AssessmentId: assessment.Id,
				Version:      1,
				Assessment:   assessment,
			}
			res = tx.Debug().Create(version)

			if res.Error != nil {
				return res.Error
			}
		} else {
			return versionRes.Error
		}

		result = assessment.Id

		return nil
	})

	return result, err
}

func (sv AssessmentService) GetAssessments() ([]AssessmentModel, error) {
	var entities []entity.Assessment
	res := sv.db.Debug().Find(&entities)
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

func (sv AssessmentService) DeleteAssessment(id int64) error {
	a := &entity.Assessment{}
	res := sv.db.First(a, id)
	if res.Error != nil {
		return res.Error
	}
	res = sv.db.Debug().Delete(a)
	return res.Error
}
