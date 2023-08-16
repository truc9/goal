package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/tnoss/goal/internal/core"
	model "github.com/tnoss/goal/internal/model/stats"
)

func (h *Handler) GetBookingOverallStats(c echo.Context) (err error) {
	var userCount int64
	var bookedCount int64
	h.DB.Model(&core.User{}).Count(&userCount)
	nextPeriod, _ := h.Repo.GetNextPeriod()

	h.DB.
		Where("booking_period_id = ?", nextPeriod.Id).
		Select("COUNT(user_id)").
		Group("user_id").
		Find(&core.Booking{}).Count(&bookedCount)

	return c.JSON(http.StatusOK, model.BookingOverall{
		Booked:   int(bookedCount),
		Unbooked: int(userCount) - int(bookedCount),
	})
}
