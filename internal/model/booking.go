package model

import "time"

type (
	OfficeBooking struct {
		Dates []time.Time `json:"dates"`
	}
)
