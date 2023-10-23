package hse

import (
	"errors"

	"github.com/samber/lo"
	"github.com/truc9/goal/internal/entity"
	"github.com/truc9/goal/internal/shared/model"
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

func (sv AssessmentService) Create(userId int64, model *AssessmentModel) (int64, error) {
	var result int64
	err := sv.db.Transaction(func(tx *gorm.DB) error {
		assessment, err := entity.NewAssessment(userId, model.Name, model.Description)
		if err != nil {
			return err
		}

		res := tx.Create(assessment)

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
				Assessment:   *assessment,
			}
			res = tx.Create(version)

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

func (sv AssessmentService) GetAll() ([]AssessmentModel, error) {
	var entities []entity.Assessment
	res := sv.db.Order("created_at desc").Find(&entities)
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

func (sv AssessmentService) GetAssessmentPairItems() ([]model.PairItem, error) {
	pairItems := []model.PairItem{}

	res := sv.db.Raw(`
		SELECT asm.name, v.id
		FROM assessment_versions v
		JOIN assessments asm ON v.assessment_id = asm.id
	`).Scan(&pairItems)

	return pairItems, res.Error
}

func (sv AssessmentService) Delete(id int64) error {
	a := &entity.Assessment{}
	res := sv.db.First(a, id)
	if res.Error != nil {
		return res.Error
	}

	v := &entity.AssessmentVersion{}
	res = sv.db.Where("assessment_id = ?", a.Id).First(v)
	if res.Error != nil {
		return res.Error
	}

	return sv.db.Transaction(func(tx *gorm.DB) error {
		res = tx.Delete(v)
		if res.Error != nil {
			return res.Error
		}

		res = tx.Delete(a)
		return res.Error
	})
}

func (sv AssessmentService) GetVersions(id int64) ([]AssessmentVersionModel, error) {
	entities := []entity.AssessmentVersion{}

	res := sv.db.
		Preload("Questions").
		Where("assessment_id = ?", id).
		Select(
			"id",
			"version",
		).
		Find(&entities)

	if res.Error != nil {
		return nil, res.Error
	}

	result := lo.Map(entities, func(item entity.AssessmentVersion, index int) AssessmentVersionModel {
		return AssessmentVersionModel{
			Id:            item.Id,
			Version:       item.Version,
			QuestionCount: len(item.Questions),
		}
	})

	return result, nil
}

func (sv AssessmentService) Update(id int64, model *AssessmentModel) error {
	assessment := &entity.Assessment{}
	if err := sv.db.Find(assessment, id).Error; err != nil {
		return err
	}

	err := assessment.Update(model.Name, model.Description, model.UpdatedBy)

	if err != nil {
		return err
	}

	return sv.db.Save(&assessment).Error
}
