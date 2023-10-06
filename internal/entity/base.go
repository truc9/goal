package entity

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Base struct {
	Id        int64     `gorm:"primarykey;autoIncrement;index" json:"id"`
	Uid       uuid.UUID `json:"uid"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime:milli" json:"updatedAt"`
}

func (entity *Base) BeforeCreate(tx *gorm.DB) (err error) {
	entity.Uid = uuid.New()
	return
}

func (entity *Base) AfterUpdate(tx *gorm.DB) (err error) {
	entity.UpdatedAt = time.Now().UTC()
	return
}
