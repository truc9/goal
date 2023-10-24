package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

var (
	Secret           string
	ConnectionString string
	SeedData         bool
)

const (
	secretKey = "SECRET_KEY"
	database  = "DATABASE"
	seedData  = "SEED_DATA"
)

func init() {
	err := godotenv.Load()

	if err != nil {
		log.Println("Environment .env does not exist. env variables getting from pipeline")
	}

	Secret = os.Getenv(secretKey)
	ConnectionString = os.Getenv(database)
	SeedData, _ = strconv.ParseBool(os.Getenv(seedData))

	log.Println("env variables loaded")
}
