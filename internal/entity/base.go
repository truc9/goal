package entity

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Base struct {
	Id          int64     `gorm:"primarykey;autoIncrement;index" json:"id"`
	Uid         uuid.UUID `json:"uid"`
	CreatedDate time.Time `gorm:"autoCreateTime" json:"createdDate"`
	UpdatedDate time.Time `gorm:"autoUpdateTime:milli" json:"updatedDate"`
}

func (entity *Base) BeforeCreate(tx *gorm.DB) (err error) {
	entity.Uid = uuid.New()
	entity.CreatedDate = time.Now().UTC()
	return
}

func (entity *Base) AfterUpdate(tx *gorm.DB) (err error) {
	entity.UpdatedDate = time.Now().UTC()
	return
}
