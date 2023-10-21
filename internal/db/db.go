package db

import (
	"log"
	"sync"

	"github.com/truc9/goal/internal/config"
	"github.com/truc9/goal/internal/entity"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	once sync.Once
	db   *gorm.DB
)

func createSingleInstanceDb() *gorm.DB {
	once.Do(func() {
		dbCtx, err := gorm.Open(postgres.Open(config.ConnectionString), &gorm.Config{})

		if err != nil {
			log.Fatalln(err)
		}

		dbCtx.AutoMigrate(
			&entity.User{},
			&entity.Role{},
			&entity.Booking{},
			&entity.BookingPeriod{},
			&entity.Assessment{},
			&entity.AssessmentVersion{},
			&entity.Question{},
			&entity.ChoiceAnswer{},
			&entity.UserPreference{},
		)

		seeder := &Seeder{
			DB: dbCtx,
		}

		seeder.Seed()
		db = dbCtx
	})

	return db
}

func New() *gorm.DB {
	return createSingleInstanceDb()
}
