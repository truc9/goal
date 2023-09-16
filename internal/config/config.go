package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var Secret string

const (
	secretKey = "SECRET_KEY"
)

func init() {
	err := godotenv.Load()

	if err != nil {
		log.Println("Environment .env does not exist. env variables getting from pipeline")
	}

	Secret = os.Getenv(secretKey)

	log.Printf("Found secret %s\n", Secret)
}
