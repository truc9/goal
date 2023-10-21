package entity

import (
	"fmt"
	"strings"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type RoleTypeId int

const (
	RoleAdminId   RoleTypeId = 1
	RoleManagerId RoleTypeId = 2
	RoleUserId    RoleTypeId = 3
)

type RoleNameType string

const (
	RoleAdmin   RoleNameType = "admin"
	RoleManager RoleNameType = "manager"
	RoleUser    RoleNameType = "normal_user"
)

type User struct {
	Base
	FirstName      string `json:"firstName"`
	LastName       string `json:"lastName"`
	EmployeeNumber string `json:"employeeNumber"`
	Email          string `json:"email"`
	UserName       string `json:"username"`
	HashPassword   string `json:"hashPassword"`
	RoleId         int    `json:"roleId"`
	Role           Role   `gorm:"foreignKey:RoleId" json:"role"`
	IsActive       bool   `json:"isActive"`
}

func (u *User) SetPassword(password string) {
	hash := hashPassword(password)
	u.HashPassword = hash
}

func (u *User) SetRole(roleId RoleTypeId) {
	u.RoleId = int(roleId)
}

func (u User) VerifyPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.HashPassword), []byte(password))
	return err == nil
}

func (u *User) AllocateEmployeeNumberWithId(en string) {
	u.EmployeeNumber = fmt.Sprintf("%s%d", en, u.Id)
}

func (u *User) AllocateEmployeeNumber(en string) {
	u.EmployeeNumber = en
}

func (u *User) Activate() {
	if u.Uid == uuid.Nil {
		u.Uid = uuid.New()
	}
	u.IsActive = true
}

func (u *User) Deactivate() {
	u.IsActive = false
}

func NewUser(firstName, lastName, email string, userName string) (*User, error) {
	if strings.TrimSpace(email) == "" {
		return nil, fmt.Errorf("email must be provided")
	}

	un := userName

	if len(un) == 0 {
		un = fmt.Sprintf("%s.%s", strings.ToLower(firstName), strings.ToLower(lastName))
	}

	user := &User{
		FirstName: firstName,
		LastName:  lastName,
		Email:     email,
		UserName:  un,
		RoleId:    int(RoleUserId),
		IsActive:  true,
	}

	return user, nil
}

func hashPassword(pw string) (hash string) {
	bytes, _ := bcrypt.GenerateFromPassword([]byte(pw), 14)
	return string(bytes)
}
