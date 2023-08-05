package core

import (
	"time"

	"github.com/google/uuid"
)

type BookingPeriod struct {
	Id   uuid.UUID `gorm:"primaryKey" json:"id"`
	From time.Time `json:"from"`
	To   time.Time `json:"to"`
}

type Booking struct {
	Id              uuid.UUID `gorm:"primaryKey" json:"id"`
	BookingPeriodId uuid.UUID `json:"bookingPeriodId"`
	UserId          uuid.UUID `json:"userId"`
	User            User      `json:"user" gorm:"foreignKey:UserId"`
	Date            time.Time `json:"date"`
}

func CreateNextBookingPeriod(current time.Time) (period *BookingPeriod) {
	daysUntilMonday := time.Monday - current.Weekday()
	if daysUntilMonday <= 0 {
		daysUntilMonday += 7
	}
	start := current.AddDate(0, 0, int(daysUntilMonday))
	end := start.AddDate(0, 0, 6)

	return &BookingPeriod{
		Id:   uuid.New(),
		From: time.Date(start.Year(), start.Month(), start.Day(), 0, 0, 0, 0, time.UTC),
		To:   time.Date(end.Year(), end.Month(), end.Day(), 0, 0, 0, 0, time.UTC),
	}
}
