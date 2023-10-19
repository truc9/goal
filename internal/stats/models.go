package stats

import "time"

type BookingModel struct {
	Booked   int   `json:"booked"`
	Unbooked int   `json:"unbooked"`
	Total    int   `json:"total"`
	PeriodId int64 `json:"periodId"`
}

type BookingPerPeriodModel struct {
	From  time.Time `json:"from"`
	To    time.Time `json:"to"`
	Total int64     `json:"total"`
}
