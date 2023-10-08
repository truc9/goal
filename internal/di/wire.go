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
	wire.Build(bookingSet)
	return controller.BookingController{}
}

func GetPeriodCtrl() controller.PeriodController {
	wire.Build(periodSet)
	return controller.PeriodController{}
}

func GetIAMCtrl() controller.IamController {
	wire.Build(iamSet)
	return controller.IamController{}
}

func GetStatCtrl() controller.StatController {
	wire.Build(statSet)
	return controller.StatController{}
}

func GetScheduler() scheduler.DailyScheduler {
	wire.Build(scheduler.NewDailyScheduler, booking.NewPeriodService, db.New)
	return scheduler.DailyScheduler{}
}

func GetWebsocketCtrl() controller.WebSocketController {
	wire.Build(websocketSet)
	return controller.WebSocketController{}
}

func GetAssessmentCtrl() controller.AssessmentController {
	wire.Build(assessmentSet)
	return controller.AssessmentController{}
}

func GetQuestionController() controller.QuestionController {
	wire.Build(questionSet)
	return controller.QuestionController{}
}

func GetEmployeeController() controller.EmployeeController {
	wire.Build(employeeSet)
	return controller.EmployeeController{}
}
