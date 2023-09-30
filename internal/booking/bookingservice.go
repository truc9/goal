package booking

import (
	"log"

	"github.com/google/uuid"
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

func (sv BookingService) CreateBooking(userId uuid.UUID, model *entity.Booking) (*entity.Booking, error) {
	booking := &entity.Booking{
		Id:              uuid.New(),
		UserId:          userId,
		BookingPeriodId: model.BookingPeriodId,
		Date:            model.Date,
	}

	res := sv.db.Create(booking)

	if res.Error != nil {
		return nil, res.Error
	}

	return booking, nil
}

func (sv BookingService) DeleteBooking(bookingId uuid.UUID) error {
	entity := &entity.Booking{}
	res := sv.db.Where("id = ?", bookingId).First(entity)
	log.Println(entity)
	if res.Error != nil {
		return res.Error
	}
	sv.db.Delete(entity)
	return nil
}

func (sv BookingService) GetBookingsByPeriod(periodId uuid.UUID) []GrouppedUserBooking {
	var userBookingItems []UserBookingItem

	// Split select fields to multiple row for readability
	columns := "bookings.id as booking_id, " +
		"bookings.booking_period_id, " +
		"bookings.user_id, " +
		"CONCAT(users.first_name, ' ', users.last_name) as user_display_name , " +
		"bookings.date as booking_date"

	// Query statement
	sv.db.Debug().
		Table("users").
		Order("users.first_name asc").
		Select(columns).
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

func (sv BookingService) GetMyBookings(userId, bookingPeriodId uuid.UUID) []*entity.Booking {
	bookings := []*entity.Booking{}
	sv.db.Where("user_id = ? AND booking_period_id = ?", userId, bookingPeriodId).Find(&bookings)
	return bookings
}
