package handler

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/tnoss/goal/internal/core"
)

func (h *Handler) CreateNextPeriod(c echo.Context) (err error) {
	period := core.CreateNextBookingPeriod(time.Now())

	existing := &core.BookingPeriod{}
	r := h.Db.Where("\"from\" = ?", period.From).First(&existing)

	if r.RowsAffected != 0 {
		return c.JSON(http.StatusOK, existing)
	}

	res := h.Db.Create(period)
	if res.Error != nil {
		return
	}
	return c.JSON(http.StatusOK, period)
}

func (h *Handler) GetCurrentPeriod(c echo.Context) (err error) {
	period := &core.BookingPeriod{}
	now := time.Now()
	res := h.Db.Where("\"from\" <= ? AND \"to\" > ?", now, now).First(period)
	if res.Error != nil {
		return
	}
	return c.JSON(http.StatusOK, period)
}

func (h *Handler) GetPeriods(c echo.Context) (err error) {
	var periods []core.BookingPeriod
	res := h.Db.Find(&periods)
	if res.Error != nil {
		return
	}
	return c.JSON(http.StatusOK, periods)
}