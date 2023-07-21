package db

import (
	"log"

	"github.com/tnoss/goal/internal/model"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Init() *gorm.DB {
	// TODO: get from env
	conn := "postgres://postgres:admin@localhost:5432/goal"
	db, err := gorm.Open(postgres.Open(conn), &gorm.Config{})

	if err != nil {
		log.Fatalln(err)
	}

	db.AutoMigrate(&model.Account{}, &model.User{})

	return db
}
