package controller

import "github.com/truc9/goal/internal/users"

type UserController struct {
	us users.UserService
}

func NewUserController(us users.UserService) UserController {
	return UserController{
		us: us,
	}
}
