package booking

import (
	"github.com/samber/lo"
	"github.com/truc9/goal/internal/entity"
	"gorm.io/gorm"
)

type BookingService struct {
	db *gorm.DB
}

func NewBookingService(db *gorm.DB) BookingService {
	return BookingService{
		db: db,
	}
}

func (sv BookingService) CreateBooking(userId int64, model *entity.Booking) (*entity.Booking, error) {
	booking := &entity.Booking{
		UserId:          userId,
		BookingPeriodId: model.BookingPeriodId,
		Date:            model.Date.UTC(),
	}

	res := sv.db.Create(booking)

	if res.Error != nil {
		return nil, res.Error
	}

	return booking, nil
}

func (sv BookingService) DeleteBooking(bookingId int64) error {
	entity := &entity.Booking{}
	res := sv.db.Where("id = ?", bookingId).First(entity)
	if res.Error != nil {
		return res.Error
	}
	sv.db.Delete(entity)
	return nil
}

func (sv BookingService) GetBookingsByPeriod(periodId int64) []GrouppedUserBooking {
	var userBookingItems []UserBookingItem

	// Query statement
	sv.db.
		Table("users").
		Order("users.first_name asc").
		Select(`
			bookings.id AS booking_id,
			bookings.booking_period_id,
			bookings.user_id,
			CONCAT(users.first_name, ' ', users.last_name) AS user_display_name, 
			bookings.date AS booking_date
		`).
		Joins("LEFT JOIN bookings ON bookings.user_id = users.id AND bookings.booking_period_id = ?", periodId).
		Scan(&userBookingItems)

	// Process dataset to groupped dataset using samber/lo (lodash-alike)
	groups := lo.GroupBy(userBookingItems, func(item UserBookingItem) string {
		return item.UserDisplayName
	})

	// Populate to final result set
	groupedResult := []GrouppedUserBooking{}
	for key, items := range groups {
		groupedResult = append(groupedResult, GrouppedUserBooking{
			UserDisplayName: key,
			Bookings:        items,
		})
	}

	return groupedResult
}

func (sv BookingService) GetMyBookings(userId, periodId int64) []*entity.Booking {
	bookings := []*entity.Booking{}
	sv.db.
		Where("user_id = ? AND booking_period_id = ?", userId, periodId).
		Find(&bookings)

	return bookings
}
