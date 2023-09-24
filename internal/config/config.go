package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var (
	Secret           string
	ConnectionString string
)

const (
	SECRET_KEY = "SECRET_KEY"
	DATABASE   = "DATABASE"
)

func init() {
	err := godotenv.Load()

	if err != nil {
		log.Println("Environment .env does not exist. env variables getting from pipeline")
	}

	Secret = os.Getenv(SECRET_KEY)
	ConnectionString = os.Getenv(DATABASE)

	log.Printf("Found secret %s\n", Secret)
	log.Printf("Found connection string %s\n", ConnectionString)
}
