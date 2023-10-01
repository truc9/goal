package entity

import (
	"time"

	"github.com/truc9/goal/internal/utils/timeutil"
)

type BookingPeriod struct {
	Base
	From time.Time `json:"from"`
	To   time.Time `json:"to"`
}

func CreateNextPeriod(current time.Time) (period *BookingPeriod) {
	start := timeutil.GetNextMonday(current)
	end := start.AddDate(0, 0, 6)

	return &BookingPeriod{
		From: time.Date(start.Year(), start.Month(), start.Day(), 0, 0, 0, 0, time.UTC),
		To:   time.Date(end.Year(), end.Month(), end.Day(), 0, 0, 0, 0, time.UTC),
	}
}
