package booking

import (
	"errors"
	"time"

	"github.com/samber/lo"
	"github.com/truc9/goal/internal/utils/timeutil"
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

func (s PeriodService) GetNextPeriod() (p *BookingPeriod, err error) {
	period := &BookingPeriod{}
	todayNextWeek := timeutil.GetTodayNextWeek(time.Now())
	res := s.db.Where("\"from\" <= ? AND \"to\" >= ?", todayNextWeek, todayNextWeek).First(period)
	if res.Error != nil {
		return nil, res.Error
	}
	return period, nil
}

func (s PeriodService) CreateNextPeriod() (*BookingPeriod, error) {
	period := CreateNextPeriod(time.Now())
	entity := &BookingPeriod{}
	r := s.db.Where("\"from\" = ?", period.From).First(&entity)
	if r.RowsAffected != 0 {
		return nil, errors.New("duplicated")
	}

	res := s.db.Create(period)

	if res.Error != nil {
		return nil, res.Error
	}
	return period, nil
}

func (s PeriodService) GetPeriods() ([]PeriodModel, error) {
	var entities []BookingPeriod
	res := s.db.Find(&entities)
	if res.Error != nil {
		return nil, res.Error
	}

	todayNextWeek := timeutil.GetTodayNextWeek(time.Now())

	periods := lo.Map(entities, func(item BookingPeriod, index int) PeriodModel {
		return PeriodModel{
			Id:              item.Id,
			From:            item.From,
			To:              item.To,
			IsCurrentPeriod: item.From.Before(todayNextWeek) && item.To.After(todayNextWeek),
		}
	})

	return periods, nil
}
