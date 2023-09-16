package ws

import (
	"log"
)

type Hub struct {
	clients    map[*Client]bool
	connect    chan *Client
	disconnect chan *Client
	payload    chan interface{}
}

func NewHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		connect:    make(chan *Client),
		disconnect: make(chan *Client),
		payload:    make(chan interface{}),
	}
}

// This method executed on a different go routine
// A lightweight thread manages clients and messages via channel
func (h *Hub) Run() {
	for {
		// keep 1 second for debug
		// time.Sleep(time.Second)

		select {
		case c, ready := <-h.connect:
			if ready {
				h.clients[c] = true
				log.Println("user joined")
			}
		case c, ready := <-h.disconnect:
			if ready {
				delete(h.clients, c)
				log.Println("user unjoined")
			}
		case pl, ready := <-h.payload:
			if ready {
				for cl := range h.clients {
					cl.Dispatch(pl)
					log.Printf("dispatched to client %s", cl.Id)
				}
			}
		}
	}
}

func (h *Hub) AddClient(c *Client) {
	h.connect <- c
}

func (h *Hub) RemoveClient(c *Client) {
	h.disconnect <- c
}

func (h *Hub) AddPayload(pl interface{}) {
	h.payload <- pl
}
