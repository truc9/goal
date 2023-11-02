package controller

import (
	"net/http"

	"github.com/labstack/echo/v4"
	b "github.com/truc9/goal/internal/booking"
)

type PeriodController struct {
	periodSv b.PeriodService
}

func NewPeriodController(periodSv b.PeriodService) PeriodController {
	return PeriodController{
		periodSv: periodSv,
	}
}

func (ctrl PeriodController) CreateNextPeriod(c echo.Context) (err error) {
	period, err := ctrl.periodSv.CreateNextPeriod()
	if err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}
	return c.JSON(http.StatusOK, period)
}

func (ctrl PeriodController) GetNextPeriod(c echo.Context) (err error) {
	period, err := ctrl.periodSv.GetNextPeriod()
	if err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}
	return c.JSON(http.StatusOK, period)
}

func (ctrl PeriodController) GetPeriods(c echo.Context) (err error) {
	periods, err := ctrl.periodSv.GetPeriods()
	if err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}
	return c.JSON(http.StatusOK, periods)
}
