package booking

import (
	"errors"
	"log"
	"time"

	"github.com/samber/lo"
	"github.com/truc9/goal/internal/entity"
	timeutil "github.com/truc9/goal/internal/utils/time_util"
	"gorm.io/gorm"
)

type PeriodService struct {
	db *gorm.DB
}

func NewPeriodService(db *gorm.DB) PeriodService {
	return PeriodService{
		db: db,
	}
}

func (sv PeriodService) GetNextPeriod() (p *entity.BookingPeriod, err error) {
	period := &entity.BookingPeriod{}
	todayNextWeek := timeutil.GetTodayNextWeek(time.Now())
	res := sv.db.Where("\"from\" <= ? AND \"to\" >= ?", todayNextWeek, todayNextWeek).First(period)
	if res.Error != nil {
		return nil, res.Error
	}
	return period, nil
}

func (sv PeriodService) CreateNextPeriod() (*entity.BookingPeriod, error) {
	period := entity.CreateNextPeriod(time.Now())
	log.Printf("draft next period is %v", period.From)

	entity := &entity.BookingPeriod{}

	tx := sv.db.Where("\"from\" = ?", period.From).First(&entity)
	if tx.Error != nil && errors.Is(tx.Error, gorm.ErrRecordNotFound) {
		res := sv.db.Create(period)
		if res.Error != nil {
			log.Printf("failed to create next period due to %v", res.Error)
			return nil, res.Error
		}
		log.Printf("create next period % successfully", period.From)
		return period, tx.Error
	}

	log.Printf("period for week start from %v is already open", entity.From)
	return entity, nil
}

func (sv PeriodService) GetPeriods() ([]PeriodModel, error) {
	var entities []entity.BookingPeriod
	res := sv.db.Find(&entities)
	if res.Error != nil {
		return nil, res.Error
	}

	x := time.Now()
	now := time.Date(x.Year(), x.Month(), x.Day(), 0, 0, 0, 0, time.UTC)
	todayNextWeek := timeutil.GetTodayNextWeek(now)

	periods := lo.Map(entities, func(item entity.BookingPeriod, index int) PeriodModel {
		return PeriodModel{
			Id:   int(item.Id),
			From: item.From, //Time with timezone
			To:   item.To,   //Time with timezone
			IsCurrentPeriod: (item.From.Before(todayNextWeek) && item.To.After(todayNextWeek)) ||
				isSameDate(todayNextWeek, item.To) ||
				isSameDate(todayNextWeek, item.From),
		}
	})

	return periods, nil
}

func isSameDate(d1, d2 time.Time) bool {
	return d1.Year() == d2.Year() && d1.Month() == d2.Month() && d1.Day() == d2.Day()
}
