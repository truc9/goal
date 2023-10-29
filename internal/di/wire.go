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

func GetScheduler() scheduler.DailyScheduler {
	wire.Build(scheduler.NewDailyScheduler, booking.NewPeriodService, db.New)
	return scheduler.DailyScheduler{}
}

func GetBookingController() controller.BookingController {
	wire.Build(bookingSet)
	return controller.BookingController{}
}

func GetPeriodController() controller.PeriodController {
	wire.Build(periodSet)
	return controller.PeriodController{}
}

func GetIamController() controller.IamController {
	wire.Build(iamSet)
	return controller.IamController{}
}

func GetStatController() controller.StatController {
	wire.Build(statSet)
	return controller.StatController{}
}

func GetWSController() controller.WebSocketController {
	wire.Build(websocketSet)
	return controller.WebSocketController{}
}

func GetAssessmentController() controller.AssessmentController {
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

func GetUserController() controller.UserController {
	wire.Build(userSet)
	return controller.UserController{}
}
