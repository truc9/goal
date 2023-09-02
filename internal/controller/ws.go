package controller

import (
	"fmt"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/truc9/goal/internal/booking"
	"github.com/truc9/goal/internal/stats"
	"golang.org/x/net/websocket"
)

type NotificationEvent string

const (
	BookingUpdated   NotificationEvent = "booking_updated"
	SomeOneHasJoined NotificationEvent = "someone_has_joined"
)

type WsController struct {
	stats    stats.StatsService
	bookings booking.BookingService
}

func NewWsController(stats stats.StatsService, bookings booking.BookingService) WsController {
	return WsController{
		stats:    stats,
		bookings: bookings,
	}
}

func (ctrl WsController) HandleWebSocket(c echo.Context) error {
	websocket.Handler(func(ws *websocket.Conn) {
		defer ws.Close()
		for {
			var event NotificationEvent = ""
			err := websocket.Message.Receive(ws, &event)
			if err != nil {
				c.Logger().Error(err)
			}

			switch event {
			case BookingUpdated:
				stats, _ := ctrl.stats.GetBookingOverallStats()
				websocket.Message.Send(ws, stats)
				fmt.Printf("Booking update at %s", time.Now())
			case SomeOneHasJoined:

			default:
				fmt.Println("Noop!")
			}
		}

	}).ServeHTTP(c.Response(), c.Request())
	return nil
}
