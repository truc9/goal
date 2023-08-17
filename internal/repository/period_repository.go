package repository

import (
	"fmt"
	"time"

	"github.com/tnoss/goal/internal/core"
	"github.com/tnoss/goal/internal/utils/timeutil"
)

// Get period of next week
func (r Repository) GetNextPeriod() (p *core.BookingPeriod, err error) {
	period := &core.BookingPeriod{}
	todayNextWeek := timeutil.GetTodayNextWeek(time.Now())
	fmt.Printf("Today next week is %v\n", todayNextWeek)
	res := r.DB.Where("\"from\" <= ? AND \"to\" >= ?", todayNextWeek, todayNextWeek).First(period)
	if res.Error != nil {
		return nil, res.Error
	}
	return period, nil
}
