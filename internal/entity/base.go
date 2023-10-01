package entity

import "time"

type Base struct {
	Id        int64     `gorm:"primarykey;autoIncrement;index" json:"id"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime:milli" json:"updatedAt"`
}
