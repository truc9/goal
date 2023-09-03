package scheduler

import (
	"fmt"
	"time"

	"github.com/go-co-op/gocron"
	"github.com/truc9/goal/internal/booking"
)

type DailyScheduler struct {
	periodService booking.PeriodService
}

func NewDailyScheduler(periodService booking.PeriodService) DailyScheduler {
	return DailyScheduler{
		periodService: periodService,
	}
}

func (ds DailyScheduler) Execute() {
	scheduler := gocron.NewScheduler(time.UTC)
	scheduler.Every(1).Day().Do(func() {
		period, err := ds.periodService.CreateNextPeriod()
		if err != nil {
			fmt.Printf("[ERROR] %s\n", err)
		} else {
			fmt.Println(period)
		}
		fmt.Printf("[%v] Schedule executed\n", time.Now())
	})

	scheduler.StartAsync()
}
