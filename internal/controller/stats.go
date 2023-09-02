package controller

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/truc9/goal/internal/stats"
)

type StatController struct {
	stats stats.StatsService
}

func NewStatController(stats stats.StatsService) StatController {
	return StatController{
		stats: stats,
	}
}

func (s *StatController) GetBookingOverallStats(c echo.Context) (err error) {
	result, err := s.stats.GetBookingOverallStats()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, nil)
	}

	return c.JSON(http.StatusOK, result)
}
