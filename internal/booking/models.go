package booking

import (
	"time"

	"github.com/google/uuid"
)

type (
	BookingModel struct {
		Id              uuid.UUID `json:"id"`
		BookingPeriodId uuid.UUID `json:"bookingPeriodId"`
		Date            time.Time `json:"date"`
	}

	UserBookingItem struct {
		BookingId       uuid.UUID `json:"bookingId"`
		BookingPeriodId uuid.UUID `json:"bookingPeriodId"`
		UserDisplayName string    `json:"userDisplayName"`
		BookingDate     string    `json:"bookingDate"`
	}

	GrouppedUserBooking struct {
		UserDisplayName string            `json:"userDisplayName"`
		Bookings        []UserBookingItem `json:"bookings"`
	}

	PeriodModel struct {
		Id              uuid.UUID `json:"id"`
		From            time.Time `json:"from"`
		To              time.Time `json:"to"`
		IsCurrentPeriod bool      `json:"isCurrentPeriod"`
	}
)
