package iam

import (
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	_ "github.com/joho/godotenv/autoload"
	"github.com/samber/lo"
	"github.com/truc9/goal/internal/config"
	"gorm.io/gorm"
)

type IamService struct {
	db *gorm.DB
}

type (
	CustomJwtClaims struct {
		Name  string `json:"name"`
		Email string `json:"email"`
		Role  string `json:"role"`
		jwt.RegisteredClaims
	}
)

func NewIamService(db *gorm.DB) IamService {
	return IamService{
		db: db,
	}
}

func (s IamService) GetAll() []UserModel {
	var users []User
	res := s.db.Find(&users)
	if res.Error != nil {
		return nil
	}

	result := lo.Map(users, func(u User, _ int) UserModel {
		return UserModel{
			FirstName: u.FirstName,
			LastName:  u.LastName,
			Id:        u.Id,
			Email:     u.Email,
		}
	})

	return result
}

func (s IamService) RegisterUser(r *RegisterModel) (*User, error) {
	dup := s.db.Where("email = ?", r.Email, r.UserName).First(&User{})
	if dup.RowsAffected != 0 {
		return nil, errors.New("email already in use")
	}

	user, err := CreateUser(r.FirstName, r.LastName, r.Email, r.UserName)

	if err != nil {
		return nil, err
	}

	user.SetPassword(r.Password)

	res := s.db.Create(&user)

	if res.Error != nil {
		return nil, res.Error
	}

	return user, nil
}

func (s IamService) Login(req LoginModel) (*LoginResult, error) {
	user := User{}
	res := s.db.Joins("Role").First(&user, "email=?", req.Email)

	if res.Error != nil {
		return nil, errors.New("User does not exist")
	}

	if !user.VerifyPassword(req.Password) {
		return nil, errors.New("invalid password")
	}

	expiry := jwt.NewNumericDate(time.Now().Add(time.Hour * 3))

	claims := &CustomJwtClaims{
		fmt.Sprintf("%s %s", user.FirstName, user.LastName),
		user.Email,
		user.Role.Name,
		jwt.RegisteredClaims{
			ID:        user.Id.String(),
			ExpiresAt: expiry,
		},
	}

	fmt.Printf("Auth user: %v\n", claims.Role)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err := token.SignedString([]byte(config.SecretKey))
	if err != nil {
		return nil, err
	}

	return &LoginResult{
		Id:     user.Id,
		Email:  user.Email,
		Name:   fmt.Sprintf("%s %s", user.FirstName, user.LastName),
		Role:   user.Role.Name,
		Expire: expiry.UnixMilli(),
		Token:  signedToken,
	}, nil
}

func (s IamService) AssignRole(userId uuid.UUID, ra RoleAssignmentModel) (err error) {
	user := User{}
	if res := s.db.Find(&user, userId); res.RowsAffected == 0 {
		return errors.New("User not found")
	}

	role := Role{}
	if res := s.db.Find(&role, ra.RoleId); res.RowsAffected == 0 {
		return errors.New("Role not found")
	}

	user.SetRole(RoleType(ra.RoleId))

	s.db.Save(&user)

	return nil
}
