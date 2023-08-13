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

func CreateNextPeriod(current time.Time) (period *BookingPeriod) {
	start := GetNextMonday(current)
	end := start.AddDate(0, 0, 6)

	return &BookingPeriod{
		Id:   uuid.New(),
		From: time.Date(start.Year(), start.Month(), start.Day(), 0, 0, 0, 0, time.UTC),
		To:   time.Date(end.Year(), end.Month(), end.Day(), 23, 59, 59, 0, time.UTC),
	}
}

func GetNextMonday(current time.Time) time.Time {
	// Enum from 0 - 6
	// 0	1	 2  ...	6
	// Sun  Mon  Tue...	Sat
	daysUntilMonday := int(time.Monday) - int(current.Weekday())

	// Sat - Sun = 6 - 0 = 6 <=> next Sat in 6 days (mon-tue-wed-thu-fri-sat)
	// Mon - Tue = 1 - 2 = -1 <=> next Mon in 6 days (-1 + 7 = 6) (wed-thu-fri-sat-sun-mon)
	if daysUntilMonday <= 0 {
		daysUntilMonday += 7
	}

	// Get current day add day count
	monday := current.AddDate(0, 0, daysUntilMonday)
	return monday
}

func GetTodayNextWeek(current time.Time) time.Time {
	dayCount := int(current.Weekday()) + 7
	todayNextWeek := current.AddDate(0, 0, dayCount)
	return todayNextWeek
}
