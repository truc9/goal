package app

import "github.com/truc9/goal/internal/users/app/dto"

type UserService interface {
	GetAll() (arr []dto.UserModel)
}
