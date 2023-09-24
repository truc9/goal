package db

import (
	"log"
	"sync"

	"github.com/truc9/goal/internal/config"
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
