package booking

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/truc9/goal/internal/entity"
)

func TestCreateNewPeriod(t *testing.T) {
	now := time.Date(2023, 8, 4, 0, 0, 0, 0, time.UTC)
	actual := entity.CreateNextPeriod(now)
	expectFrom := time.Date(2023, 8, 7, 0, 0, 0, 0, time.UTC)
	expectTo := time.Date(2023, 8, 13, 0, 0, 0, 0, time.UTC)
	assert.True(t, expectFrom.Equal(actual.From))
	assert.True(t, expectTo.Equal(actual.To))
}
