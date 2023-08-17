package handler

import (
	"github.com/tnoss/goal/internal/repository"
	"gorm.io/gorm"
)

type Handler struct {
	DB   *gorm.DB
	Repo repository.Repository
}
