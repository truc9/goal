package stats

type BookingModel struct {
	Booked   int `json:"booked"`
	Unbooked int `json:"unbooked"`
	Total    int `json:"total"`
}
