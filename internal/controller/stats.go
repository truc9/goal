package controller

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/truc9/goal/internal/stats"
	"github.com/truc9/goal/internal/utils/httpcontext"
)

type StatController struct {
	statSv stats.StatsService
}

func NewStatController(statSv stats.StatsService) StatController {
	return StatController{
		statSv: statSv,
	}
}

func (ct *StatController) GetBookingStats(c echo.Context) (err error) {
	result, err := ct.statSv.GetBookingOverallStats()

	if err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}

	return c.JSON(http.StatusOK, result)
}

func (ct *StatController) GetBookingPerPeriodStats(c echo.Context) error {
	res, err := ct.statSv.GetBookingPerPeriodStats()
	if err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}
	return c.JSON(http.StatusOK, res)
}

func (ct *StatController) GetMyAssignmentCount(c echo.Context) error {
	userId := httpcontext.CurrentUserId(c)
	count := ct.statSv.GetEmployeeAsignmentCount(userId)
	return c.JSON(http.StatusOK, count)
}
