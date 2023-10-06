package timeutil

import "time"

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
	today := time.Date(current.Year(), current.Month(), current.Day(), 0, 0, 0, 0, time.UTC)
	todayNextWeek := today.AddDate(0, 0, 7)
	return todayNextWeek
}
