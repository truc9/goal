package entity

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestCreateNewPeriod(t *testing.T) {
	res := CreateNextOfficeBookingPeriod()
	start := res.From.Weekday()
	end := res.To.Weekday()
	assert.Equal(t, time.Monday, start, "start of period should be Monday")
	assert.Equal(t, time.Sunday, end, "end of period should be Sunday")
}
