package db

import (
	"log"
	"sync"
	"time"

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
		dbCtx, err := gorm.Open(postgres.Open(config.ConnectionString), &gorm.Config{
			NowFunc: func() time.Time {
				return time.Now().UTC()
			},
		})

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
			&entity.AssessmentAssignment{},
			&entity.Question{},
			&entity.QuestionChoice{},
			&entity.UserPreference{},
		)

		if config.SeedData {
			seeder := &Seeder{
				DB: dbCtx,
			}
			seeder.Seed()
		}

		db = dbCtx
	})

	return db
}

func New() *gorm.DB {
	return createSingleInstanceDb()
}
