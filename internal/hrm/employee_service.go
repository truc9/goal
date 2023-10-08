package hrm

import (
	"github.com/samber/lo"
	"github.com/truc9/goal/internal/entity"
	"gorm.io/gorm"
)

type EmployeeService struct {
	db *gorm.DB
}

func NewEmployeeService(db *gorm.DB) EmployeeService {
	return EmployeeService{
		db: db,
	}
}

func (s *EmployeeService) GetAll() ([]EmployeeModel, error) {
	users := []entity.User{}
	if err := s.db.Where("employee_number IS NOT NULL").Find(&users).Error; err != nil {
		return nil, err
	}

	employees := lo.Map(users, func(item entity.User, index int) EmployeeModel {
		e := EmployeeModel{}
		e.Id = item.Id
		e.EmployeeNumber = item.EmployeeNumber
		e.Uid = item.Uid
		e.FirstName = item.FirstName
		e.LastName = item.LastName
		return e
	})

	return employees, nil
}
