package utils

import "time"

type TimeProvider interface {
	Now() time.Time
}
