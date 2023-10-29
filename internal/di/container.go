package di

import (
	"github.com/google/wire"
	"github.com/truc9/goal/internal/booking"
	"github.com/truc9/goal/internal/controller"
	"github.com/truc9/goal/internal/db"
	"github.com/truc9/goal/internal/hrm"
	"github.com/truc9/goal/internal/hse"
	"github.com/truc9/goal/internal/iam"
	"github.com/truc9/goal/internal/stats"
	"github.com/truc9/goal/internal/users"
)

var bookingSet = wire.NewSet(controller.NewBookingController, booking.NewBookingService, booking.NewPeriodService, db.New)
var periodSet = wire.NewSet(controller.NewPeriodController, booking.NewBookingService, booking.NewPeriodService, db.New)
var iamSet = wire.NewSet(controller.NewIamController, iam.NewIamService, db.New)
var statSet = wire.NewSet(controller.NewStatController, stats.NewStatService, booking.NewPeriodService, db.New)
var websocketSet = wire.NewSet(controller.NewWebSocketController, stats.NewStatService, booking.NewBookingService, booking.NewPeriodService, db.New)
var assessmentSet = wire.NewSet(controller.NewAssessmentController, hse.NewAssessmentService, db.New)
var questionSet = wire.NewSet(controller.NewQuestionController, hse.NewQuestionService, db.New)
var employeeSet = wire.NewSet(controller.NewEmployeeController, hrm.NewEmployeeService, users.NewUserService, db.New)
var userSet = wire.NewSet(controller.NewUserController, users.NewUserService, db.New)
