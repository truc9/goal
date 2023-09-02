package di

import (
	"github.com/google/wire"
	"github.com/truc9/goal/internal/booking"
	"github.com/truc9/goal/internal/controller"
	"github.com/truc9/goal/internal/db"
	"github.com/truc9/goal/internal/iam"
	"github.com/truc9/goal/internal/stats"
)

var BookingSet = wire.NewSet(controller.NewBookingController, booking.NewBookingService, booking.NewPeriodService, db.New)
var PeriodSet = wire.NewSet(controller.NewPeriodController, booking.NewBookingService, booking.NewPeriodService, db.New)
var IamSet = wire.NewSet(controller.NewIamController, iam.NewIamService, db.New)
var StatSet = wire.NewSet(stats.NewStatService, booking.NewPeriodService, db.New)