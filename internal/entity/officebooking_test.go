package entity

import (
	"testing"
	"time"
)

func TestCreateNewPeriod(t *testing.T) {
	res := CreateNextPeriod()
	start := res.From.Weekday()
	end := res.To.Weekday()

	if start != time.Monday {
		t.Errorf("got %s, wanted Monday", start)
	}

	if end != time.Sunday {
		t.Errorf("got %s, wanted Sunday", end)
	}
}
