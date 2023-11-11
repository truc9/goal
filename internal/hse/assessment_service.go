package hse

import (
	"errors"
	"fmt"
	"log"

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
	res := sv.db.Order("created_date desc").Find(&entities)
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
		SELECT CONCAT(asm.name, '(version ', v.version, ')') AS name, v.id
		FROM assessment_versions v
		JOIN assessments asm ON v.assessment_id = asm.id
		ORDER BY asm.name
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

func (sv AssessmentService) Assign(userId, versionId int64) error {
	var c int64
	sv.db.Debug().
		Where("user_id = ? and assessment_version_id = ?", userId, versionId).
		Select("id").
		Find(&[]entity.Assignment{}).
		Count(&c)

	log.Printf("found %v", c)

	if c > 0 {
		return fmt.Errorf("assessment version %v already assigned to %v", versionId, userId)
	}

	r := sv.db.Create(&entity.Assignment{
		UserId:              userId,
		AssessmentVersionId: versionId,
	})

	return r.Error
}

func (sv AssessmentService) Unassign(userId, versionId int64) error {
	var c int64

	deletingItems := []entity.Assignment{}
	sv.db.Debug().
		Where("user_id = ? and assessment_version_id = ?", userId, versionId).
		Select("id").
		Find(&deletingItems).
		Count(&c)

	if c == 0 {
		return fmt.Errorf("empty assignment %v", versionId)
	}

	r := sv.db.Debug().Delete(&deletingItems)

	log.Println(r.Error)

	return r.Error
}

func (sv AssessmentService) GetAssignments(userId int64) []AssignmentModel {
	entities := []entity.Assignment{}
	sv.db.Where("user_id = ?", userId).Find(&entities)
	return lo.Map(entities, func(item entity.Assignment, _ int) AssignmentModel {
		return AssignmentModel{
			UserId:    item.UserId,
			VersionId: item.AssessmentVersionId,
		}
	})
}

func (sv AssessmentService) StartAssessment(userId, assignmentId int64) error {
	asm := &entity.Assignment{}
	if err := sv.db.Find(&asm, assignmentId).Error; err != nil {
		return err
	}

	asm.Status = entity.DraftAssignment

	log.Println("About to update!!!")
	log.Print(asm.UserId)
	log.Print(asm.SubmittedById)

	sv.db.Save(&asm)

	return nil
}

func (sv AssessmentService) SubmitQuestionAnswer(assignmentId, questionId, answerId int64) {
	sv.db.Create(&entity.AssignmentQuestionAnswer{
		QuestionId:   questionId,
		AnswerId:     answerId,
		AssignmentId: assignmentId,
	})
}
