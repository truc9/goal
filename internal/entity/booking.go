package entity

import (
	"time"
)

type Booking struct {
	Base
	BookingPeriodId int       `json:"bookingPeriodId"`
	UserId          int       `json:"userId"`
	User            User      `json:"user" gorm:"foreignKey:UserId"`
	Date            time.Time `json:"date"`
}
