package infra

import (
	"github.com/truc9/goal/internal/users/domain"
	"gorm.io/gorm"
)

type (
	UserRepository struct {
		db *gorm.DB
	}
)

func ProvideUserRepo(db *gorm.DB) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

func (r UserRepository) GetByEmail(email string) (*domain.User, error) {
	var result *domain.User
	res := r.db.Where("email = ?", email).First(&result)
	if res.Error != nil {
		return nil, res.Error
	}
	return result, nil
}

func (r UserRepository) GetAll() ([]domain.User, error) {
	var result []domain.User
	res := r.db.Find(&result)
	if res.Error != nil {
		return nil, res.Error
	}
	return result, nil
}

func (r UserRepository) Create(u *domain.User) (*domain.User, error) {
	res := r.db.Create(u)
	if res.Error != nil {
		return nil, res.Error
	}
	return u, nil
}
