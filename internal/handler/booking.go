package handler

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/tnoss/goal/internal/core"
	"github.com/tnoss/goal/internal/model"
	"github.com/tnoss/goal/internal/utils/httpcontext"
)

func (h *Handler) CreatePeriod(c echo.Context) (err error) {
	period := core.CreateNextBookingPeriod()

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
	res := h.Db.Order("\"from\" desc").First(period)
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

func (h *Handler) SubmitBooking(c echo.Context) (err error) {
	userId := httpcontext.GetContextUserId(c)
	model := &model.Booking{}

	if err := c.Bind(model); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	if model.Id != uuid.Nil {
		deleted := h.Db.Delete(&core.Booking{}, model.Id)
		if deleted.Error != nil {
			return
		}
		return c.JSON(http.StatusOK, nil)
	}

	entity := &core.Booking{
		Id:              uuid.New(),
		UserId:          userId,
		BookingPeriodId: model.BookingPeriodId,
		Date:            model.Date,
	}

	res := h.Db.Create(entity)

	if res.Error != nil {
		return c.JSON(http.StatusInternalServerError, res.Error)
	}

	return c.JSON(http.StatusCreated, entity)
}

func (h *Handler) GetUserBookingsByPeriods(c echo.Context) (err error) {
	userId := httpcontext.GetContextUserId(c)
	bookingPeriodId := c.Param("bookingPeriodId")
	bookings := &[]core.Booking{}
	h.Db.Where("user_id = ? AND booking_period_id = ?", userId, bookingPeriodId).Find(bookings)
	return c.JSON(http.StatusOK, bookings)
}
