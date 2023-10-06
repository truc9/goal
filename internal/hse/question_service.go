package hse

import (
	lop "github.com/samber/lo/parallel"
	"github.com/truc9/goal/internal/entity"
	"gorm.io/gorm"
)

type QuestionService struct {
	db *gorm.DB
}

func NewQuestionService(db *gorm.DB) QuestionService {
	return QuestionService{
		db: db,
	}
}

func (sv QuestionService) GetAll(assessmentVersionId int64) []QuestionModel {
	questions := []entity.Question{}

	sv.db.Debug().
		Where("assessment_version_id = ?", assessmentVersionId).
		Model(&entity.Question{}).
		Preload("Choices").
		Find(&questions)

	models := lop.Map(questions, func(item entity.Question, _ int) QuestionModel {
		return QuestionModel{
			Id:          item.Id,
			Description: item.Description,
			Type:        item.QuestionType,
			Version:     item.AssessmentVersion.Version,
			Choices: lop.Map(item.Choices, func(item entity.ChoiceAnswer, _ int) ChoiceModel {
				return ChoiceModel{
					Id:                item.Id,
					Description:       item.Description,
					TriggerQuestionId: item.TriggerQuestionId,
				}
			}),
		}
	})

	return models
}

func (sv QuestionService) Create(model *QuestionModel) (int64, error) {
	question := entity.NewQuestion(model.Description, model.Type, model.AssessmentVersionId)
	if model.Type == entity.SingleChoice || model.Type == entity.MultipleChoice {
		for _, item := range model.Choices {
			question.AddChoice(item.Description, item.TriggerQuestionId)
		}
	}

	res := sv.db.Create(question)
	return question.Id, res.Error
}

func (sv QuestionService) Delete(id int64) error {
	err := sv.db.Transaction(func(tx *gorm.DB) error {
		question := &entity.Question{}
		findErr := sv.db.Find(question, id).Error
		if findErr != nil {
			return findErr
		}

		choices := []entity.ChoiceAnswer{}
		sv.db.Where("question_id = ?", question.Id).Find(&choices)

		delChoiceErr := sv.db.Delete(choices).Error
		if delChoiceErr != nil {
			return delChoiceErr
		}

		res := sv.db.Delete(question)
		return res.Error
	})
	return err
}
