package handler

import (
	"github.com/truc9/goal/internal/repository"
	"gorm.io/gorm"
)

type Handler struct {
	DB   *gorm.DB
	Repo repository.Repository
}
