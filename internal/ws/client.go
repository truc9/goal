package ws

import (
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type Client struct {
	Id   uuid.UUID
	Conn *websocket.Conn
}

func NewClient(conn *websocket.Conn) *Client {
	return &Client{
		Conn: conn,
		Id:   uuid.New(),
	}
}

func (c *Client) Dispatch(payload Payload) {
	c.Conn.WriteJSON(Notification{
		Event:   BookingUpdated,
		Payload: payload,
	})
}
