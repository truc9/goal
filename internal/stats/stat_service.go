package stats

import (
	"log"

	"github.com/truc9/goal/internal/booking"
	"github.com/truc9/goal/internal/entity"
	"gorm.io/gorm"
)

type StatsService struct {
	db       *gorm.DB
	periodSv booking.PeriodService
}

func NewStatService(db *gorm.DB, periodSv booking.PeriodService) StatsService {
	return StatsService{
		db:       db,
		periodSv: periodSv,
	}
}

func (sv *StatsService) GetBookingOverallStats() (model *BookingModel, err error) {
	var userCount int64
	var bookedCount int64
	sv.db.Model(&entity.User{}).Count(&userCount)

	nextPeriod, err := sv.periodSv.GetNextPeriod()
	if err != nil {
		log.Printf("err %v", err)
		return nil, err
	}

	sv.db.
		Where("booking_period_id = ?", nextPeriod.Id).
		Distinct("user_id").
		Find(&entity.Booking{}).
		Count(&bookedCount)

	return &BookingModel{
		Booked:   int(bookedCount),
		Unbooked: int(userCount) - int(bookedCount),
		Total:    int(userCount),
		PeriodId: int64(nextPeriod.Id),
	}, nil
}
