package hse

import (
	"log"

	"github.com/samber/lo"
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

func (sv QuestionService) GetByVersion(assessmentVersionId int64) []QuestionModel {
	questions := []entity.Question{}

	sv.db.Debug().
		Where("assessment_version_id = ?", assessmentVersionId).
		Order("created_date").
		Model(&entity.Question{}).
		Preload("Choices").
		Find(&questions)

	// auto set ordinal question
	_, anyZeroOrdinal := lo.Find(questions, func(item entity.Question) bool {
		return item.Ordinal == 0
	})

	// TODO: find better approach
	invalidOrdinal := false
	for i := 0; i < len(questions); i++ {
		for j := 1; j < len(questions); j++ {
			if questions[i].Ordinal == questions[j].Ordinal {
				invalidOrdinal = true
				break
			}
		}
	}

	if anyZeroOrdinal || invalidOrdinal {
		for i, q := range questions {
			q.Ordinal = int64(i + 1)
			sv.db.Save(&q)
		}
	}

	models := lop.Map(questions, func(item entity.Question, _ int) QuestionModel {
		return QuestionModel{
			Id:          item.Id,
			Ordinal:     item.Ordinal,
			Description: item.Description,
			Type:        item.QuestionType,
			Version:     item.AssessmentVersion.Version,
			Choices: lop.Map(item.Choices, func(item entity.QuestionChoice, _ int) ChoiceModel {
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
	question := entity.NewQuestion(model.Description, model.Type, model.AssessmentVersionId, model.Ordinal)

	if model.Type == entity.SingleChoice || model.Type == entity.MultipleChoice {
		for _, item := range model.Choices {
			question.AddChoice(item.Description, item.TriggerQuestionId)
		}
	} else if model.Type == entity.YesNo || model.Type == entity.YesNoNa {
		question.AddChoice("Yes", 0)
		question.AddChoice("No", 0)
		if model.Type == entity.YesNoNa {
			question.AddChoice("N/A", 0)
		}
	} else if model.Type == entity.Confirmation {
		question.AddChoice("Not Confirmed", 0)
		question.AddChoice("Confirmed", 0)
	}

	res := sv.db.Create(&question)
	return question.Id, res.Error
}

func (sv QuestionService) Delete(id int64) error {
	err := sv.db.Transaction(func(tx *gorm.DB) error {
		question := &entity.Question{}
		err := sv.db.Find(question, id).Error
		if err != nil {
			return err
		}

		err = sv.db.Where("question_id = ?", id).Delete(&entity.QuestionChoice{}).Error
		if err != nil {
			return err
		}

		res := sv.db.Delete(question, id)

		if res.Error != nil {
			return res.Error
		}

		var questions []entity.Question
		sv.db.Where("assessment_version_id = ? and ordinal > ?", question.AssessmentVersionId, question.Ordinal).Find(&questions)
		for i, q := range questions {
			old := q.Ordinal
			q.Ordinal = question.Ordinal + int64(i)
			sv.db.Save(&q)
			log.Printf("update %v ordinal from %v to %v", q.Description, old, q.Ordinal)
		}

		return nil
	})
	return err
}

func (sv QuestionService) UpdateOrdinal(srcId, dstId int64) error {
	source := &entity.Question{}
	if err := sv.db.Find(&source, srcId).Error; err != nil {
		return err
	}

	destination := &entity.Question{}
	if err := sv.db.Find(&destination, dstId).Error; err != nil {
		return err
	}

	source.SwapOrdinal(destination)

	err := sv.db.Transaction(func(tx *gorm.DB) error {
		res := tx.Save(&source)
		if res.Error != nil {
			return res.Error
		}
		res = tx.Save(&destination)
		return res.Error
	})

	return err
}
