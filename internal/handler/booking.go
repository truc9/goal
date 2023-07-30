package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/tnoss/goal/internal/entity"
	"github.com/tnoss/goal/internal/utils/httpcontext"
)

func (h *Handler) CreatePeriod(c echo.Context) (err error) {
	period := entity.CreateNextBookingPeriod()

	existing := &entity.BookingPeriod{}
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
	period := &entity.BookingPeriod{}
	res := h.Db.Order("\"from\" desc").First(period)
	if res.Error != nil {
		return
	}
	return c.JSON(http.StatusOK, period)
}

func (h *Handler) GetPeriods(c echo.Context) (err error) {
	var periods []entity.BookingPeriod
	res := h.Db.Find(&periods)
	if res.Error != nil {
		return
	}
	return c.JSON(http.StatusOK, periods)
}

func (h *Handler) BookGoToOffice(c echo.Context) (err error) {
	userId := httpcontext.GetContextUserId(c)
	model := &entity.Booking{
		UserId: userId,
	}

	if err = c.Bind(model); err != nil {
		return
	}
	return nil
}
