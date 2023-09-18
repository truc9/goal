package booking

import (
	"fmt"
	"log"
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
	log.Printf("next period is %v", period.From)
	entity := &BookingPeriod{}
	r := s.db.Where("\"from\" = ?", period.From).First(&entity)
	if r.RowsAffected != 0 {
		return nil, fmt.Errorf("period found duplicated %v", entity.From)
	}

	res := s.db.Create(period)
	log.Printf("period %v created", period.From)

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

	x := time.Now()
	now := time.Date(x.Year(), x.Month(), x.Day(), 0, 0, 0, 0, time.UTC)
	todayNextWeek := timeutil.GetTodayNextWeek(now)

	log.Printf("today next week is %v", todayNextWeek)

	periods := lo.Map(entities, func(item BookingPeriod, index int) PeriodModel {
		return PeriodModel{
			Id:   item.Id,
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
