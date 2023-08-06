package core

import (
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Id           uuid.UUID `gorm:"primaryKey" json:"id"`
	FirstName    string    `json:"firstName"`
	LastName     string    `json:"lastName"`
	Email        string    `json:"email"`
	HashPassword string    `json:"hashPassword"`
	RoleId       uuid.UUID `json:"roleId"`
	Role         Role      `gorm:"foreignKey:RoleId" json:"role"`
}

func (u *User) SetPassword(password string) {
	hash := hashPassword(password)
	u.HashPassword = hash
}

func (u *User) VerifyPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.HashPassword), []byte(password))
	return err == nil
}

func (u *User) UpdateRole(roleId uuid.UUID) {
	u.RoleId = roleId
}

func CreateUser(firstName, lastName, email string) *User {
	user := &User{
		Id:        uuid.New(),
		FirstName: firstName,
		LastName:  lastName,
		Email:     email,
	}
	return user
}

func hashPassword(pw string) (hash string) {
	bytes, _ := bcrypt.GenerateFromPassword([]byte(pw), 14)
	return string(bytes)
}
