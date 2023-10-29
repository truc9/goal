package users

import (
	"log"

	"github.com/truc9/goal/internal/entity"
	"gorm.io/gorm"
)

type UserService struct {
	db *gorm.DB
}

func NewUserService(db *gorm.DB) *UserService {
	return &UserService{
		db: db,
	}
}

func (s UserService) GetUser(userId int64) (*entity.User, error) {
	user := &entity.User{}
	if err := s.db.Find(&user, userId).Error; err != nil {
		log.Printf("user not found with id %v", userId)
		return nil, err
	}
	return user, nil
}
