package controller

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	"github.com/truc9/goal/internal/booking"
	"github.com/truc9/goal/internal/stats"
	"github.com/truc9/goal/internal/ws"
)

type (
	WebSocketController struct {
		stats    stats.StatsService
		bookings booking.BookingService
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

func (ctrl WebSocketController) ServeWS(ctx echo.Context, hub *ws.Hub) {
	upgrader.CheckOrigin = func(r *http.Request) bool {
		//TODO: check properly
		return true
	}

	conn, err := upgrader.Upgrade(ctx.Response(), ctx.Request(), nil)
	if err != nil {
		log.Fatalf("Failed ws with %v\n", err)
	}

	defer conn.Close()

	client := ws.NewClient(conn)
	hub.ClientConnect(client)

	defer hub.ClientDisconnect(client)

	notification := &ws.Notification{}
	err = conn.ReadJSON(notification)
	if err != nil {
		if websocket.IsUnexpectedCloseError(err, websocket.CloseAbnormalClosure, websocket.CloseGoingAway) {
			log.Printf("websocket closed %v", err)
			hub.ClientDisconnect(client)
		}
		return
	}

	switch notification.Event {
	case ws.BookingUpdated:
		log.Println("client updated booking")
		type dto struct {
			Stat     *stats.BookingModel           `json:"stat"`
			Bookings []booking.GrouppedUserBooking `json:"bookings"`
		}

		stat, _ := ctrl.stats.GetBookingOverallStats()
		bookings := ctrl.bookings.GetBookingsByPeriod(stat.PeriodId)

		hub.AddNotification(&ws.Notification{
			Event: ws.BookingUpdated,
			Payload: dto{
				Stat:     stat,
				Bookings: bookings,
			},
		})
	default:
		log.Println("unhandled")
	}
}
