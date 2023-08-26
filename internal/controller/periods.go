package controller

import (
	"net/http"

	"github.com/labstack/echo/v4"
	b "github.com/truc9/goal/internal/booking"
)

type PeriodController struct {
	s b.PeriodService
}

func NewPeriodController(s b.PeriodService) PeriodController {
	return PeriodController{
		s: s,
	}
}

func (h PeriodController) CreateNextPeriod(c echo.Context) (err error) {
	period, err := h.s.CreateNextPeriod()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.JSON(http.StatusOK, period)
}

func (h PeriodController) GetNextPeriod(c echo.Context) (err error) {
	period, err := h.s.GetNextPeriod()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.JSON(http.StatusOK, period)
}

func (h PeriodController) GetPeriods(c echo.Context) (err error) {
	periods, err := h.s.GetPeriods()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, periods)
}
