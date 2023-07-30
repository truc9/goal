package entity

import (
	"time"

	"github.com/google/uuid"
)

type Weekday int

const (
	Sunday Weekday = iota
	Monday
	Tuesday
	Wednesday
	Thursday
	Friday
)

// Create period for next week
// Starting from Monday
func CreateNextPeriod() (period *OfficeBookingPeriod) {
	today := time.Now()
	daysUntilMonday := time.Monday - today.Weekday()
	if daysUntilMonday <= 0 {
		daysUntilMonday += 7
	}
	start := today.AddDate(0, 0, int(daysUntilMonday))
	end := start.AddDate(0, 0, 6)

	return &OfficeBookingPeriod{
		Id:   uuid.New(),
		From: start,
		To:   end,
	}
}

type OfficeBookingPeriod struct {
	Id   uuid.UUID `json:"id"`
	From time.Time `json:"from"`
	To   time.Time `json:"to"`
}

type OfficeBooking struct {
	Id                      uuid.UUID     `json:"id"`
	OfficeBookingDurationId uuid.UUID     `json:"officeBookingDurationId"`
	UserId                  uuid.NullUUID `json:"userId"`
	Date                    time.Time     `json:"date"`
}
