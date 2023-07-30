package entity

import (
	"time"

	"github.com/google/uuid"
)

// Create period for next week
// Starting from Monday
func CreateNextOfficeBookingPeriod() (period *OfficeBookingPeriod) {
	today := time.Now()

	daysUntilMonday := time.Monday - today.Weekday()
	if daysUntilMonday <= 0 {
		daysUntilMonday += 7
	}
	start := today.AddDate(0, 0, int(daysUntilMonday))
	end := start.AddDate(0, 0, 6)

	return &OfficeBookingPeriod{
		Id:   uuid.New(),
		From: time.Date(start.Year(), start.Month(), start.Day(), 0, 0, 0, 0, time.UTC),
		To:   time.Date(end.Year(), end.Month(), end.Day(), 0, 0, 0, 0, time.UTC),
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
