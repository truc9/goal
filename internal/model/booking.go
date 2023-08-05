package model

import (
	"time"

	"github.com/google/uuid"
)

type (
	Booking struct {
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
)
