package db

import (
	"log"
	"time"

	"github.com/truc9/goal/internal/entity"
	"gorm.io/gorm"
)

type Seeder struct {
	DB *gorm.DB
}

func (s Seeder) Seed() {
	var roleCount int64
	if err := s.DB.Model(&entity.Role{}).Count(&roleCount).Error; err == nil {
		if roleCount == 0 {
			x := time.Now()
			adminRole, _ := entity.CreateNewRole(entity.RoleAdminId, string(entity.RoleAdmin), "Administrator, highest permission role")
			managerRole, _ := entity.CreateNewRole(entity.RoleManagerId, string(entity.RoleManager), "Office Manager, 2nd highest permission role")
			userRole, _ := entity.CreateNewRole(entity.RoleUserId, string(entity.RoleUser), "Normal user role (employee...)")
			s.DB.Create(adminRole)
			s.DB.Create(managerRole)
			s.DB.Create(userRole)
			log.Printf("Data seeding for Role is completed in %v ms\n", time.Since(x).Milliseconds())
		}
	}

	// Create Admin user when seeding data
	// TODO: provide password reset after the first login
	var userCount int64
	if err := s.DB.Model(&entity.User{}).Count(&userCount).Error; err == nil {
		if userCount == 0 {
			x := time.Now()
			// TODO: read seeding email/password from env
			user, _ := entity.NewUser("Admin", "User", "admin@goal.com", "admin")
			user.SetPassword("admin")
			user.SetRole(entity.RoleAdminId)
			s.DB.Create(&user)
			log.Printf("Data seeding for Admin is completed in %v ms\n", time.Since(x).Milliseconds())
		}
	}
}
