package repository

import "gorm.io/gorm"

type Repository struct {
	DB *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return Repository{
		DB: db,
	}
}
