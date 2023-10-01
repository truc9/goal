package booking

import (
	"time"
)

type (
	BookingModel struct {
		Id              int       `json:"id"`
		BookingPeriodId int       `json:"bookingPeriodId"`
		Date            time.Time `json:"date"`
	}

	UserBookingItem struct {
		BookingId       int    `json:"bookingId"`
		BookingPeriodId int    `json:"bookingPeriodId"`
		UserDisplayName string `json:"userDisplayName"`
		BookingDate     string `json:"bookingDate"`
	}

	GrouppedUserBooking struct {
		UserDisplayName string            `json:"userDisplayName"`
		Bookings        []UserBookingItem `json:"bookings"`
	}

	PeriodModel struct {
		Id              int       `json:"id"`
		From            time.Time `json:"from"`
		To              time.Time `json:"to"`
		IsCurrentPeriod bool      `json:"isCurrentPeriod"`
	}
)
