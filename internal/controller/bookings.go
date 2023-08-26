package controller

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/truc9/goal/internal/booking"
	"github.com/truc9/goal/internal/utils/httpcontext"
)

type BookingController struct {
	s booking.BookingService
}

func NewBookingController(s booking.BookingService) BookingController {
	return BookingController{
		s: s,
	}
}

func (ctrl *BookingController) SubmitBooking(c echo.Context) (err error) {
	userId := httpcontext.GetUserId(c)
	model := &booking.Booking{}
	if err := c.Bind(model); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	booking, _ := ctrl.s.CreateBooking(userId, *model)

	return c.JSON(http.StatusCreated, booking)
}

func (h BookingController) DeleteBooking(c echo.Context) (err error) {
	bookingId, _ := uuid.Parse(c.Param("bookingId"))
	h.s.DeleteBooking(bookingId)
	return c.JSON(http.StatusOK, nil)
}

func (h BookingController) GetAllBookings(c echo.Context) (err error) {
	periodId, _ := uuid.Parse(c.Param("bookingPeriodId"))
	bookings := h.s.GetBookingsByPeriod(periodId)
	return c.JSON(http.StatusOK, bookings)
}

func (h BookingController) GetMyBookings(c echo.Context) (err error) {
	userId := httpcontext.GetUserId(c)
	bookingPeriodId, _ := uuid.Parse(c.Param("bookingPeriodId"))
	bookings := h.s.GetMyBookings(userId, bookingPeriodId)
	return c.JSON(http.StatusOK, bookings)
}
