package entity

type UserPreference struct {
	Base
	UserId int64
	User   User `gorm:"foreignKey:UserId"`
	// WeekDay int, separate by comma ;
	DefaultOfficeDay string
	DateTimeFormat   string
}
