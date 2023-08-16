package model

type BookingOverall struct {
	Booked   int `json:"booked"`
	Unbooked int `json:"unbooked"`
}
