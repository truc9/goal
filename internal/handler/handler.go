package handler

import "gorm.io/gorm"

type Handler struct {
	Db *gorm.DB
}
