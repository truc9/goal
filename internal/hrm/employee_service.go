package hrm

import (
	"log"

	"github.com/samber/lo"
	"github.com/truc9/goal/internal/entity"
	"github.com/truc9/goal/internal/utils/random"
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

func (s EmployeeService) GetAll() ([]EmployeeModel, error) {
	users := []entity.User{}
	if err := s.db.Where("employee_number IS NOT NULL").Order("id asc").Find(&users).Error; err != nil {
		return nil, err
	}

	employees := lo.Map(users, func(item entity.User, index int) EmployeeModel {
		e := EmployeeModel{}
		e.Id = item.Id
		e.IsActive = item.IsActive
		e.EmployeeNumber = item.EmployeeNumber
		e.Uid = item.Uid
		e.FirstName = item.FirstName
		e.LastName = item.LastName
		e.CreatedDate = item.CreatedDate
		e.UpdatedDate = item.UpdatedDate
		return e
	})

	return employees, nil
}

func (s EmployeeService) AllocEmployeeNumber(userId int64) error {
	user, err := s.getUser(userId)
	if err != nil {
		return err
	}

	empNumber := random.GenStringId()
	var dupEmpNumber int64
	err = s.db.Where("employee_number = ?", empNumber).Find(&entity.User{}).Count(&dupEmpNumber).Error
	if err != nil {
		log.Println(err)
		return err
	}

	if dupEmpNumber > 0 {
		user.AllocateEmployeeNumberWithId(empNumber)
	} else {
		user.AllocateEmployeeNumber(empNumber)
	}

	s.db.Save(&user)
	return nil
}

func (s EmployeeService) ActivateUser(userId int64) error {
	user, err := s.getUser(userId)
	if err != nil {
		return err
	}

	user.Activate()
	s.db.Save(&user)

	return nil
}

func (s EmployeeService) DeactivateUser(userId int64) error {
	user, err := s.getUser(userId)
	if err != nil {
		return err
	}

	user.Deactivate()
	s.db.Save(&user)

	return nil
}

func (s EmployeeService) getUser(userId int64) (*entity.User, error) {
	user := &entity.User{}
	if err := s.db.Find(&user, userId).Error; err != nil {
		log.Printf("user not found with id %v", userId)
		return nil, err
	}
	return user, nil
}
