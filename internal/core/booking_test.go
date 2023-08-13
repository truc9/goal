package core

import (
	"fmt"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestCreateNewPeriod(t *testing.T) {
	now := time.Date(2023, 8, 4, 0, 0, 0, 0, time.UTC)
	actual := CreateNextPeriod(now)
	expectFrom := time.Date(2023, 8, 7, 0, 0, 0, 0, time.UTC)
	expectTo := time.Date(2023, 8, 13, 0, 0, 0, 0, time.UTC)
	fmt.Println(actual)
	fmt.Println(expectFrom)
	fmt.Println(expectTo)
	assert.True(t, expectFrom.Equal(actual.From), "start of period should be Monday")
	assert.True(t, expectTo.Equal(actual.To), "end of period should be Sunday")
}
