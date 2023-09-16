package db

import (
	"log"
	"time"

	"github.com/truc9/goal/internal/iam"
	"gorm.io/gorm"
)

type Seeder struct {
	DB *gorm.DB
}

func (s Seeder) Seed() {
	var roleCount int64
	if err := s.DB.Model(&iam.Role{}).Count(&roleCount).Error; err == nil {
		if roleCount == 0 {
			x := time.Now()
			adminRole, _ := iam.CreateNewRole(iam.RoleAdminId, string(iam.RoleAdmin), "Administrator, highest permission role")
			managerRole, _ := iam.CreateNewRole(iam.RoleManagerId, string(iam.RoleManager), "Office Manager, 2nd highest permission role")
			userRole, _ := iam.CreateNewRole(iam.RoleUserId, string(iam.RoleUser), "Normal user role (employee...)")
			s.DB.Create(adminRole)
			s.DB.Create(managerRole)
			s.DB.Create(userRole)
			log.Printf("Data seeding for Role is completed in %v ms\n", time.Since(x).Milliseconds())
		}
	}

	// Create Admin user when seeding data
	// TODO: provide password reset after the first login
	var userCount int64
	if err := s.DB.Model(&iam.User{}).Count(&userCount).Error; err == nil {
		if userCount == 0 {
			x := time.Now()
			// TODO: read seeding email/password from env
			user, _ := iam.CreateUser("Admin", "User", "admin@goal.com", "admin")
			user.SetPassword("admin")
			user.SetRole(iam.RoleAdminId)
			s.DB.Create(&user)
			log.Printf("Data seeding for Admin is completed in %v ms\n", time.Since(x).Milliseconds())
		}
	}
}
