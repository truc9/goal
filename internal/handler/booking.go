package handler

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/tnoss/goal/internal/core"
	"github.com/tnoss/goal/internal/model"
	"github.com/tnoss/goal/internal/utils/httpcontext"
)

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

func (h Handler) DeleteBooking(c echo.Context) (err error) {
	bookingId := c.Param("bookingId")
	entity := &core.Booking{}
	res := h.Db.Where("id = ?", bookingId).First(entity)
	if res.Error != nil {
		return c.JSON(http.StatusInternalServerError, res.Error)
	}
	h.Db.Delete(entity)
	return c.JSON(http.StatusOK, nil)
}

func (h *Handler) GetAllBookings(c echo.Context) (err error) {
	periodId := c.Param("bookingPeriodId")
	bookings := &[]core.Booking{}
	res := h.Db.Where("booking_period_id = ?", periodId).Find(bookings)
	if res.Error != nil {
		return c.JSON(http.StatusInternalServerError, res.Error)
	}
	return c.JSON(http.StatusOK, bookings)
}

func (h *Handler) GetMyBookings(c echo.Context) (err error) {
	userId := httpcontext.GetContextUserId(c)
	bookingPeriodId := c.Param("bookingPeriodId")
	bookings := &[]core.Booking{}
	h.Db.Where("user_id = ? AND booking_period_id = ?", userId, bookingPeriodId).Find(bookings)
	return c.JSON(http.StatusOK, bookings)
}
