package config

import (
	"log"

	"github.com/joho/godotenv"
)

var SecretKey string

func init() {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("error while loading .env file")
	}

	envMap, _ := godotenv.Read()

	SecretKey = envMap["SECRET_KEY"]
}
