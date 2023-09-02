package booking

import (
	"github.com/google/uuid"
	"github.com/samber/lo"
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

func (h BookingService) CreateBooking(userId uuid.UUID, model Booking) (*Booking, error) {
	booking := &Booking{
		Id:              uuid.New(),
		UserId:          userId,
		BookingPeriodId: model.BookingPeriodId,
		Date:            model.Date,
	}

	res := h.db.Create(booking)

	if res.Error != nil {
		return nil, res.Error
	}

	return booking, nil
}

func (h BookingService) DeleteBooking(bookingId uuid.UUID) error {
	entity := &Booking{}
	res := h.db.Where("id = ?", bookingId).First(entity)
	if res.Error != nil {
		return res.Error
	}
	h.db.Delete(entity)
	return nil
}

func (h BookingService) GetBookingsByPeriod(periodId uuid.UUID) []GrouppedUserBooking {
	var userBookingItems []UserBookingItem

	// Split select fields to multiple row for readability
	columns := "bookings.id as booking_id, " +
		"bookings.booking_period_id, " +
		"bookings.user_id, " +
		"CONCAT(users.first_name, ' ', users.last_name) as user_display_name , " +
		"bookings.date as booking_date"

	// Query statement
	h.db.Debug().
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

func (h BookingService) GetMyBookings(userId, bookingPeriodId uuid.UUID) []*Booking {
	bookings := []*Booking{}
	h.db.Where("user_id = ? AND booking_period_id = ?", userId, bookingPeriodId).Find(&bookings)
	return bookings
}