//go:build wireinject
// +build wireinject

package controller

import (
	"github.com/google/wire"
	"github.com/truc9/goal/internal/stats"
)

func InitBookingController() BookingController {
	wire.Build(BookingSet)
	return BookingController{}
}

func InitPeriodController() PeriodController {
	wire.Build(PeriodSet)
	return PeriodController{}
}

func InitIamController() IamController {
	wire.Build(IamSet)
	return IamController{}
}

func InitStatsService() stats.StatsService {
	wire.Build(StatSet)
	return stats.StatsService{}
}
