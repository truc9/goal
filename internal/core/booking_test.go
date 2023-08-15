package core

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestCreateNewPeriod(t *testing.T) {
	now := time.Date(2023, 8, 4, 0, 0, 0, 0, time.UTC)
	actual := CreateNextPeriod(now)
	expectFrom := time.Date(2023, 8, 7, 0, 0, 0, 0, time.UTC)
	expectTo := time.Date(2023, 8, 13, 23, 59, 59, 0, time.UTC)
	assert.True(t, expectFrom.Equal(actual.From))
	assert.True(t, expectTo.Equal(actual.To))
}
