package ws

import (
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type Client struct {
	id   uuid.UUID
	conn *websocket.Conn
}

func NewClient(conn *websocket.Conn) *Client {
	return &Client{
		conn: conn,
		id:   uuid.New(),
	}
}

func (c *Client) Send(n *Notification) {
	c.conn.WriteJSON(n)
}
