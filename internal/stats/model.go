package stats

import "github.com/google/uuid"

type BookingModel struct {
	Booked   int `json:"booked"`
	Unbooked int `json:"unbooked"`
	Total    int `json:"total"`
	PeriodId uuid.UUID
}
