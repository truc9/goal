package ws

type (
	Event        string
	Payload      interface{}
	Notification struct {
		Event   Event   `json:"event"`
		Payload Payload `json:"payload"`
	}
)

const (
	BookingUpdated Event = "booking_updated"
	UserJoined     Event = "user_joined"
)
