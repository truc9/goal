package entity

import (
	"time"

	"github.com/google/uuid"
)

type Booking struct {
	Id              uuid.UUID `gorm:"primaryKey" json:"id"`
	BookingPeriodId uuid.UUID `json:"bookingPeriodId"`
	UserId          uuid.UUID `json:"userId"`
	User            User      `json:"user" gorm:"foreignKey:UserId"`
	Date            time.Time `json:"date"`
}
