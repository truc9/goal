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
)
