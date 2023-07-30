package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/tnoss/goal/internal/entity"
)

func (h *Handler) CreatePeriod(c echo.Context) (err error) {
	period := entity.CreateNextOfficeBookingPeriod()

	existing := &entity.OfficeBookingPeriod{}
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

func (h *Handler) GetPeriods(c echo.Context) (err error) {
	var periods []entity.OfficeBookingPeriod
	res := h.Db.Find(&periods)
	if res.Error != nil {
		return
	}
	return c.JSON(http.StatusOK, periods)
}

func (h *Handler) BookGoToOffice(c echo.Context) (err error) {
	model := &entity.OfficeBooking{}
	if err = c.Bind(model); err != nil {
		return
	}
	return nil
}
