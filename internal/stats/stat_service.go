package stats

import (
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

func (sv *StatsService) GetBookingPerPeriodStats() ([]BookingPerPeriodModel, error) {
	stats := []BookingPerPeriodModel{}
	res := sv.db.Raw(`
		SELECT bp.from, bp.to, COUNT(b.user_id) AS total
		FROM bookings b	
		JOIN booking_periods bp ON b.booking_period_id = bp.id
		GROUP BY bp.from, bp.to
		ORDER BY bp.from
	`).Scan(&stats)

	if res.Error != nil {
		return nil, res.Error
	}

	return stats, nil
}

func (sv *StatsService) GetEmployeeAsignmentCount(employeeId int64) int64 {
	var count int64
	sv.db.Where("user_id = ?", employeeId).Find(&[]entity.Assignment{}).Count(&count)
	return count
}
