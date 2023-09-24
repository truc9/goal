package booking

import (
	"time"

	"github.com/google/uuid"
)

type BookingPeriod struct {
	Id   uuid.UUID `gorm:"primaryKey" json:"id"`
	From time.Time `json:"from"`
	To   time.Time `json:"to"`
}
