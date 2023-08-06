package db

import (
	"fmt"

	"github.com/tnoss/goal/internal/core"
	"github.com/tnoss/goal/internal/core/enums"
	"gorm.io/gorm"
)

type Seeding struct {
	DB *gorm.DB
}

func (s Seeding) Seed() {
	var roleCount int64
	if err := s.DB.Model(&core.Role{}).Count(&roleCount).Error; err == nil {
		if roleCount == 0 {
			fmt.Println("Data seeding for Role is started")
			adminRole, _ := core.CreateNewRole(enums.Admin, "Admin", "Administrator, highest permission role")
			managerRole, _ := core.CreateNewRole(enums.Manager, "Manager", "Office Manager, 2nd highest permission role")
			userRole, _ := core.CreateNewRole(enums.User, "User", "Normal user role (employee...)")
			s.DB.Create(adminRole)
			s.DB.Create(managerRole)
			s.DB.Create(userRole)
			fmt.Println("Data seeding for Role is completed")
		}
	}

	// Create Admin user when seeding data
	// TODO: provide password reset after the first login
	var userCount int64
	if err := s.DB.Model(&core.User{}).Count(&userCount).Error; err == nil {
		if userCount == 0 {
			fmt.Println("Data seeding for Admin is started")
			//TODO: read seeding email/password from env
			user := core.CreateUser("Admin", "User", "admin@goal.com")
			user.SetPassword("admin")
			s.DB.Create(&user)
			fmt.Println("Data seeding for Admin is completed")
		}
	}
}
