package ws

const (
	BookingUpdated Event = "booking_updated"
	Connect        Event = "connected"
	Disconnect     Event = "disconnected"
)

type (
	Event        string
	Payload      interface{}
	Notification struct {
		Event   Event   `json:"event"`
		Payload Payload `json:"payload"`
	}
)
