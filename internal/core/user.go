package core

import (
	"github.com/google/uuid"
	"github.com/tnoss/goal/internal/core/enums"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Id           uuid.UUID `gorm:"primaryKey" json:"id"`
	FirstName    string    `json:"firstName"`
	LastName     string    `json:"lastName"`
	Email        string    `json:"email"`
	HashPassword string    `json:"hashPassword"`
	RoleId       int       `json:"roleId"`
	Role         Role      `gorm:"foreignKey:RoleId" json:"role"`
}

func (u *User) SetPassword(password string) {
	hash := hashPassword(password)
	u.HashPassword = hash
}

func (u *User) SetRole(roleId enums.RoleType) {
	u.RoleId = int(roleId)
}

func (u *User) VerifyPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.HashPassword), []byte(password))
	return err == nil
}

func CreateUser(firstName, lastName, email string) *User {
	user := &User{
		Id:        uuid.New(),
		FirstName: firstName,
		LastName:  lastName,
		Email:     email,
		RoleId:    int(enums.RoleUserId),
	}
	return user
}

func hashPassword(pw string) (hash string) {
	bytes, _ := bcrypt.GenerateFromPassword([]byte(pw), 14)
	return string(bytes)
}
