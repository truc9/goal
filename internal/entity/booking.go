package entity

import (
	"time"
)

type Booking struct {
	Base
	BookingPeriodId int64     `json:"bookingPeriodId"`
	UserId          int64     `json:"userId"`
	User            User      `json:"user" gorm:"foreignKey:UserId"`
	Date            time.Time `json:"date"`
}
