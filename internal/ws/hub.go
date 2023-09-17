package ws

import (
	"log"
)

type Hub struct {
	clients      map[*Client]bool
	connect      chan *Client
	disconnect   chan *Client
	notification chan *Notification
}

func NewHub() *Hub {
	return &Hub{
		clients:      make(map[*Client]bool),
		connect:      make(chan *Client),
		disconnect:   make(chan *Client),
		notification: make(chan *Notification),
	}
}

// This method executed on a different go routine
//
// A lightweight thread manages clients and messages via channel
func (h *Hub) Run() {
	for {
		// keep 1 second for debug
		// time.Sleep(time.Second)

		select {
		case c, ready := <-h.connect:
			if ready {
				h.clients[c] = true
			}
		case c, ready := <-h.disconnect:
			if ready {
				delete(h.clients, c)
			}
		case n, ready := <-h.notification:
			if ready {
				// iterate through all connected clients and send the message
				for client := range h.clients {
					client.Send(n)
					log.Printf("dispatched to client %s", client.id)
				}
			}
		}
	}
}

// User connect
func (h *Hub) ClientConnect(c *Client) {
	h.connect <- c
}

// User disconnected
func (h *Hub) ClientDisconnect(c *Client) {
	h.disconnect <- c
}

// Add client notification to channel in hub
func (h *Hub) AddNotification(n *Notification) {
	h.notification <- n
}
