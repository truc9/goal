//go:build wireinject
// +build wireinject

package di

import (
	"github.com/google/wire"
	"github.com/truc9/goal/internal/booking"
	"github.com/truc9/goal/internal/controller"
	"github.com/truc9/goal/internal/db"
	"github.com/truc9/goal/internal/scheduler"
	"github.com/truc9/goal/internal/stats"
)

func InitBookingController() controller.BookingController {
	wire.Build(BookingSet)
	return controller.BookingController{}
}

func InitPeriodController() controller.PeriodController {
	wire.Build(PeriodSet)
	return controller.PeriodController{}
}

func InitIamController() controller.IamController {
	wire.Build(IamSet)
	return controller.IamController{}
}

func InitStatsService() stats.StatsService {
	wire.Build(StatSet)
	return stats.StatsService{}
}

func InitScheduler() scheduler.DailyScheduler {
	wire.Build(scheduler.NewDailyScheduler, booking.NewPeriodService, db.New)
	return scheduler.DailyScheduler{}
}
