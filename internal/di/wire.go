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

func GetBookingCtrl() controller.BookingController {
	wire.Build(BookingSet)
	return controller.BookingController{}
}

func GetPeriodCtrl() controller.PeriodController {
	wire.Build(PeriodSet)
	return controller.PeriodController{}
}

func GetIAMCtrl() controller.IamController {
	wire.Build(IamSet)
	return controller.IamController{}
}

func GetStatCtrl() controller.StatController {
	wire.Build(StatSet)
	return controller.StatController{}
}

func GetScheduler() scheduler.DailyScheduler {
	wire.Build(scheduler.NewDailyScheduler, booking.NewPeriodService, db.New)
	return scheduler.DailyScheduler{}
}

func GetWebsocketCtrl() controller.WebSocketController {
	wire.Build(WsSet)
	return controller.WebSocketController{}
}

func GetAssessmentCtrl() controller.AssessmentController {
	wire.Build(AssessmentSet)
	return controller.AssessmentController{}
}
