package db

import (
	"log"

	"github.com/tnoss/goal/internal/entity"
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

	db.AutoMigrate(
		&entity.Account{},
		&entity.User{},
		&entity.BookingPeriod{},
		&entity.Booking{},
	)

	return db
}
