package handler

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/truc9/goal/internal/core"
	model "github.com/truc9/goal/internal/model/stats"
)

func (h *Handler) GetBookingOverallStats(c echo.Context) (err error) {
	var userCount int64
	var bookedCount int64
	h.DB.Model(&core.User{}).Count(&userCount)
	nextPeriod, _ := h.Repo.GetNextPeriod()

	h.DB.
		Where("booking_period_id = ?", nextPeriod.Id).
		Distinct("user_id").
		Find(&core.Booking{}).
		Count(&bookedCount)

	fmt.Println(bookedCount)

	return c.JSON(http.StatusOK, model.BookingOverall{
		Booked:   int(bookedCount),
		Unbooked: int(userCount) - int(bookedCount),
		Total:    int(userCount),
	})
}
