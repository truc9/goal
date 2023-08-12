package db

import (
	"fmt"
	"time"

	"github.com/tnoss/goal/internal/core"
	"github.com/tnoss/goal/internal/core/enums"
	"gorm.io/gorm"
)

type Seeder struct {
	DB *gorm.DB
}

func (s Seeder) Seed() {
	var roleCount int64
	if err := s.DB.Model(&core.Role{}).Count(&roleCount).Error; err == nil {
		if roleCount == 0 {
			x := time.Now()
			adminRole, _ := core.CreateNewRole(enums.RoleAdminId, string(enums.RoleAdmin), "Administrator, highest permission role")
			managerRole, _ := core.CreateNewRole(enums.RoleManagerId, string(enums.RoleManager), "Office Manager, 2nd highest permission role")
			userRole, _ := core.CreateNewRole(enums.RoleUserId, string(enums.RoleUser), "Normal user role (employee...)")
			s.DB.Create(adminRole)
			s.DB.Create(managerRole)
			s.DB.Create(userRole)
			fmt.Printf("Data seeding for Role is completed in %v ms\n", time.Since(x).Milliseconds())
		}
	}

	// Create Admin user when seeding data
	// TODO: provide password reset after the first login
	var userCount int64
	if err := s.DB.Model(&core.User{}).Count(&userCount).Error; err == nil {
		if userCount == 0 {
			x := time.Now()
			// TODO: read seeding email/password from env
			user := core.CreateUser("Admin", "User", "admin@goal.com")
			user.SetPassword("admin")
			user.SetRole(enums.RoleAdminId)
			s.DB.Create(&user)
			fmt.Printf("Data seeding for Admin is completed in %v ms\n", time.Since(x).Milliseconds())
		}
	}
}
