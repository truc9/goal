package db

import (
	"log"
	"sync"

	"github.com/truc9/goal/internal/booking"
	"github.com/truc9/goal/internal/iam"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	once sync.Once
	db   *gorm.DB
)

// type Database struct {
// 	Context *gorm.DB
// }

func createSingleInstanceDb() *gorm.DB {
	once.Do(func() {
		conn := "postgres://postgres:admin@localhost:5432/goal"
		dbObj, err := gorm.Open(postgres.Open(conn), &gorm.Config{})

		if err != nil {
			log.Fatalln(err)
		}

		dbObj.AutoMigrate(
			&iam.User{},
			&iam.Role{},
			&booking.BookingPeriod{},
			&booking.Booking{},
		)

		seeder := &Seeder{
			DB: dbObj,
		}

		seeder.Seed()
		db = dbObj
	})

	return db
}

func New() *gorm.DB {
	return createSingleInstanceDb()
}

// TODO: deprecated
// func Init() *gorm.DB {
// 	// TODO: get from env
// 	conn := "postgres://postgres:admin@localhost:5432/goal"
// 	db, err := gorm.Open(postgres.Open(conn), &gorm.Config{})

// 	if err != nil {
// 		log.Fatalln(err)
// 	}

// 	db.AutoMigrate(
// 		&iam.User{},
// 		&booking.BookingPeriod{},
// 		&booking.Booking{},
// 		&iam.Role{},
// 	)

// 	seeder := &Seeder{
// 		DB: db,
// 	}
// 	seeder.Seed()

// 	return db.Debug()
// }
