package controller

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/truc9/goal/internal/booking"
	"github.com/truc9/goal/internal/entity"
	"github.com/truc9/goal/internal/utils/httpcontext"
)

type BookingController struct {
	bookingSv booking.BookingService
}

func NewBookingController(s booking.BookingService) BookingController {
	return BookingController{
		bookingSv: s,
	}
}

// Submit Booking godoc
//
//	@Summary		Submit booking
//	@Tags			bookings
//	@Accept			json
//	@Produce		json
//	@Param			model body		entity.Booking true "Submit Booking"
//	@Success		200	{object}	entity.Booking
//	@Router			/api/bookings [post]
func (ctrl *BookingController) SubmitBooking(c echo.Context) (err error) {
	userId := httpcontext.GetUserId(c)
	model := &entity.Booking{}
	if err := c.Bind(model); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	booking, _ := ctrl.bookingSv.CreateBooking(userId, model)

	return c.JSON(http.StatusCreated, booking)
}

// Delete Booking godoc
//
//	@Summary		Delete booking
//	@Tags			bookings
//	@Accept			json
//	@Produce		json
//	@Param			bookingId path int true "Booking ID"
//	@Success		200
//	@Router			/api/bookings/{bookingId} [delete]
func (ctrl BookingController) DeleteBooking(c echo.Context) (err error) {
	bookingId, _ := uuid.Parse(c.Param("bookingId"))
	ctrl.bookingSv.DeleteBooking(bookingId)
	return c.JSON(http.StatusOK, nil)
}

// Get All Bookings godoc
//
//	@Summary		Get all bookings
//	@Tags			bookings
//	@Accept			json
//	@Produce		json
//	@Success		200	{array}	entity.GrouppedUserBooking
//	@Router			/api/bookings [get]
func (ctrl BookingController) GetAllBookings(c echo.Context) (err error) {
	periodId, _ := uuid.Parse(c.Param("bookingPeriodId"))
	bookings := ctrl.bookingSv.GetBookingsByPeriod(periodId)
	return c.JSON(http.StatusOK, bookings)
}

// Get All Bookings by Period ID
//
//	@Summary		Get all bookings by Period ID
//	@Tags			bookings
//	@Accept			json
//	@Produce		json
//	@Param			bookingPeriodId path int true "Booking Period ID"
//	@Success		200	{array}	entity.Booking
//	@Router			/api/bookings/{bookingPeriodId} [get]
func (h BookingController) GetMyBookings(c echo.Context) (err error) {
	userId := httpcontext.GetUserId(c)
	bookingPeriodId, _ := uuid.Parse(c.Param("bookingPeriodId"))
	bookings := h.bookingSv.GetMyBookings(userId, bookingPeriodId)
	return c.JSON(http.StatusOK, bookings)
}
