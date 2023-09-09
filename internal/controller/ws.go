package controller

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	"github.com/truc9/goal/internal/booking"
	"github.com/truc9/goal/internal/stats"
)

type event string

type payload interface{}

const (
	BookingUpdated   event = "booking_updated"
	SomeOneHasJoined event = "user_joined"
)

type (
	WebSocketController struct {
		stats    stats.StatsService
		bookings booking.BookingService
	}

	notification struct {
		Event   event   `json:"event"`
		Payload payload `json:"payload"`
	}
)

func NewWebSocketController(stats stats.StatsService, bookings booking.BookingService) WebSocketController {
	return WebSocketController{
		stats:    stats,
		bookings: bookings,
	}
}

var (
	upgrader = websocket.Upgrader{}
)

func (ctrl WebSocketController) ServeWS(c echo.Context) error {
	//TODO: check origin
	upgrader.CheckOrigin = func(r *http.Request) bool {
		return true
	}

	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		log.Fatalf("Failed ws with %v", err)
	}

	defer ws.Close()

	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			c.Logger().Error(err)
		}

		switch string(msg) {
		case string(BookingUpdated):
			data, _ := ctrl.stats.GetBookingOverallStats()
			fmt.Println("dispatch notification")
			fmt.Println(data)
			ws.WriteJSON(notification{
				Event:   BookingUpdated,
				Payload: data,
			})
		}
	}
}
