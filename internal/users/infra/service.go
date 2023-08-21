package infra

import (
	"github.com/samber/lo"
	"github.com/truc9/goal/internal/users/app/dto"
	"github.com/truc9/goal/internal/users/domain"
)

type (
	UserService struct {
		userRepo *UserRepository
	}
)

func ProvideUserService() *UserService {
	return &UserService{}
}

func (s UserService) GetAll() (arr []dto.UserModel) {
	collection, _ := s.userRepo.GetAll()
	result := lo.Map(collection, func(u domain.User, index int) dto.UserModel {
		return dto.UserModel{
			Id:        u.Id,
			FirstName: u.FirstName,
			LastName:  u.LastName,
			Email:     u.Email,
			UserName:  u.UserName,
			RoleName:  u.Role.Name,
			RoleId:    u.RoleId,
		}
	})
	return result
}
