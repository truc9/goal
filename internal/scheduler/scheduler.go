package scheduler

import (
	"log"
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

func (ds DailyScheduler) Run() {
	sch := gocron.NewScheduler(time.UTC)
	sch.Every(1).Day().Do(func() {
		_, err := ds.periodService.CreateNextPeriod()
		if err != nil {
			log.Printf("error when create period %s\n", err)
		}
		log.Println("schedule executed")
	})

	sch.StartAsync()
}
