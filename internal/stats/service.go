package stats

import (
	"github.com/truc9/goal/internal/booking"
	"github.com/truc9/goal/internal/entity"
	"gorm.io/gorm"
)

type StatsService struct {
	tx       *gorm.DB
	periodSv booking.PeriodService
}

func NewStatService(tx *gorm.DB, periodSv booking.PeriodService) StatsService {
	return StatsService{
		tx:       tx,
		periodSv: periodSv,
	}
}

func (sv *StatsService) GetBookingOverallStats() (model BookingModel, err error) {
	var userCount int64
	var bookedCount int64
	sv.tx.Model(&entity.User{}).Count(&userCount)
	nextPeriod, _ := sv.periodSv.GetNextPeriod()

	sv.tx.
		Where("booking_period_id = ?", nextPeriod.Id).
		Distinct("user_id").
		Find(&entity.Booking{}).
		Count(&bookedCount)

	return BookingModel{
		Booked:   int(bookedCount),
		Unbooked: int(userCount) - int(bookedCount),
		Total:    int(userCount),
		PeriodId: int(nextPeriod.Id),
	}, nil
}
