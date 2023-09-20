package stats

import (
	"github.com/truc9/goal/internal/booking"
	"github.com/truc9/goal/internal/iam"
	"gorm.io/gorm"
)

type StatsService struct {
	db            *gorm.DB
	periodService booking.PeriodService
}

func NewStatService(db *gorm.DB, periodService booking.PeriodService) StatsService {
	return StatsService{
		db:            db,
		periodService: periodService,
	}
}

func (s *StatsService) GetBookingOverallStats() (model BookingModel, err error) {
	var userCount int64
	var bookedCount int64
	s.db.Model(&iam.User{}).Count(&userCount)
	nextPeriod, _ := s.periodService.GetNextPeriod()

	s.db.
		Where("booking_period_id = ?", nextPeriod.Id).
		Distinct("user_id").
		Find(&booking.Booking{}).
		Count(&bookedCount)

	return BookingModel{
		Booked:   int(bookedCount),
		Unbooked: int(userCount) - int(bookedCount),
		Total:    int(userCount),
		PeriodId: nextPeriod.Id,
	}, nil
}
