package controller

import (
	"log"
	"net/http"
	"strings"

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

func (ctrl WebSocketController) ServeWS(ctx echo.Context, h *ws.Hub) {
	upgrader.CheckOrigin = func(r *http.Request) bool {
		return strings.Contains(r.Host, "localhost") ||
			strings.Contains(r.Host, "app.goal.co.uk")
	}

	conn, err := upgrader.Upgrade(ctx.Response(), ctx.Request(), nil)
	if err != nil {
		log.Fatalf("Failed ws with %v\n", err)
	}

	defer conn.Close()

	cl := ws.NewClient(conn)
	h.AddClient(cl)

	notification := &ws.Notification{}
	err = conn.ReadJSON(notification)
	if err != nil {
		log.Printf("error when read messasge %v", err)
		h.RemoveClient(cl)
		return
	}

	switch notification.Event {
	case ws.BookingUpdated:
		log.Println("booking updated ack")
		data, _ := ctrl.stats.GetBookingOverallStats()
		h.AddPayload(data)
	default:
		log.Println("unhandled")
	}
}
