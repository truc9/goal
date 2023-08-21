package db

import (
	"log"

	"github.com/truc9/goal/internal/core"
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
		&core.Account{},
		&core.User{},
		&core.BookingPeriod{},
		&core.Booking{},
		&core.Role{},
		&core.Policy{},
	)

	seeder := &Seeder{
		DB: db,
	}
	seeder.Seed()

	return db.Debug()
}
