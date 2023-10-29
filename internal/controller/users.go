package controller

import "github.com/truc9/goal/internal/users"

type UserController struct {
	userSv *users.UserService
}

func NewUserController(userSv *users.UserService) UserController {
	return UserController{
		userSv: userSv,
	}
}
