package controller

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/truc9/goal/internal/stats"
)

type StatController struct {
	statSv stats.StatsService
}

func NewStatController(statSv stats.StatsService) StatController {
	return StatController{
		statSv: statSv,
	}
}

func (ctrl *StatController) GetBookingStats(c echo.Context) (err error) {
	result, err := ctrl.statSv.GetBookingOverallStats()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, nil)
	}

	return c.JSON(http.StatusOK, result)
}
