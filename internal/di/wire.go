//go:build wireinject
// +build wireinject

package di

import (
	"github.com/google/wire"
	"github.com/truc9/goal/internal/booking"
	"github.com/truc9/goal/internal/controller"
	"github.com/truc9/goal/internal/db"
	"github.com/truc9/goal/internal/scheduler"
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

func InitStatController() controller.StatController {
	wire.Build(StatSet)
	return controller.StatController{}
}

func InitScheduler() scheduler.DailyScheduler {
	wire.Build(scheduler.NewDailyScheduler, booking.NewPeriodService, db.New)
	return scheduler.DailyScheduler{}
}

func InitWsController() controller.WsController {
	wire.Build(WsSet)
	return controller.WsController{}
}
