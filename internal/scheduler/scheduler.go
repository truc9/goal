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
	fmt.Println("Executing...")
	scheduler.Every(1).Day().Do(func() {
		ds.periodService.CreateNextPeriod()
		fmt.Printf("%v executed\n", time.Now())
	})

	scheduler.StartAsync()
}
