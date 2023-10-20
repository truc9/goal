package random

import (
	"math/rand"
	"time"
)

const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
const idLength = 8

var seededRand *rand.Rand = rand.New(rand.NewSource(time.Now().UnixNano()))

func GenStringId() string {

	b := make([]byte, idLength)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}
