package handler

import (
	"fmt"
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/samber/lo"
	"github.com/tnoss/goal/internal/core"
	"github.com/tnoss/goal/internal/model"
	"github.com/tnoss/goal/internal/utils/httpcontext"
)

func (h *Handler) SubmitBooking(c echo.Context) (err error) {
	userId := httpcontext.GetUserId(c)
	model := &model.Booking{}

	if err := c.Bind(model); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	if model.Id != uuid.Nil {
		deleted := h.DB.Delete(&core.Booking{}, model.Id)
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

	res := h.DB.Create(entity)

	if res.Error != nil {
		return c.JSON(http.StatusInternalServerError, res.Error)
	}

	return c.JSON(http.StatusCreated, entity)
}

func (h Handler) DeleteBooking(c echo.Context) (err error) {
	bookingId := c.Param("bookingId")
	entity := &core.Booking{}
	res := h.DB.Where("id = ?", bookingId).First(entity)
	if res.Error != nil {
		return c.JSON(http.StatusInternalServerError, res.Error)
	}
	h.DB.Delete(entity)
	return c.JSON(http.StatusOK, nil)
}

func (h *Handler) GetAllBookings(c echo.Context) (err error) {
	periodId := c.Param("bookingPeriodId")

	var userBookingItems []model.UserBookingItem

	// Split select fields to multiple row for readability
	columns := "bookings.id as booking_id, " +
		"bookings.booking_period_id, " +
		"bookings.user_id, " +
		"CONCAT(users.first_name, ' ', users.last_name) as user_display_name , " +
		"bookings.date as booking_date"

	// Query statement
	res := h.DB.Debug().
		Table("users").
		Order("users.first_name asc").
		Select(columns).
		Joins("LEFT JOIN bookings ON bookings.user_id = users.id AND bookings.booking_period_id = ?", periodId).
		Scan(&userBookingItems)

	// Process dataset to groupped dataset using samber/lo (lodash-alike)
	groups := lo.GroupBy(userBookingItems, func(item model.UserBookingItem) string {
		return item.UserDisplayName
	})

	// Populate to final result set
	groupedResult := []model.GrouppedUserBooking{}
	for key, items := range groups {
		fmt.Println(key)
		groupedResult = append(groupedResult, model.GrouppedUserBooking{
			UserDisplayName: key,
			Bookings:        items,
		})
	}

	if res.Error != nil {
		return c.JSON(http.StatusInternalServerError, res.Error)
	}

	return c.JSON(http.StatusOK, groupedResult)
}

func (h *Handler) GetMyBookings(c echo.Context) (err error) {
	userId := httpcontext.GetUserId(c)
	bookingPeriodId := c.Param("bookingPeriodId")
	bookings := &[]core.Booking{}
	h.DB.Where("user_id = ? AND booking_period_id = ?", userId, bookingPeriodId).Find(bookings)
	return c.JSON(http.StatusOK, bookings)
}
