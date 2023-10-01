package booking

import (
	"log"
	"strconv"

	"github.com/samber/lo"
	"github.com/truc9/goal/internal/entity"
	"gorm.io/gorm"
)

type BookingService struct {
	tx *gorm.DB
}

func NewBookingService(tx *gorm.DB) BookingService {
	return BookingService{
		tx: tx,
	}
}

func (sv BookingService) CreateBooking(userId int, model *entity.Booking) (*entity.Booking, error) {
	booking := &entity.Booking{
		UserId:          userId,
		BookingPeriodId: model.BookingPeriodId,
		Date:            model.Date,
	}

	log.Printf("Booking %v", booking)

	res := sv.tx.Debug().Create(booking)

	if res.Error != nil {
		return nil, res.Error
	}

	return booking, nil
}

func (sv BookingService) DeleteBooking(bookingId int) error {
	entity := &entity.Booking{}
	res := sv.tx.Where("id = ?", bookingId).First(entity)
	if res.Error != nil {
		return res.Error
	}
	sv.tx.Delete(entity)
	return nil
}

func (sv BookingService) GetBookingsByPeriod(periodId int) []GrouppedUserBooking {
	var userBookingItems []UserBookingItem

	// Split select fields to multiple row for readability
	columns := "bookings.id as booking_id, " +
		"bookings.booking_period_id, " +
		"bookings.user_id, " +
		"CONCAT(users.first_name, ' ', users.last_name) as user_display_name , " +
		"bookings.date as booking_date"

	// Query statement
	sv.tx.Debug().
		Table("users").
		Order("users.first_name asc").
		Select(columns).
		Joins("LEFT JOIN bookings ON bookings.user_id = users.id AND bookings.booking_period_id = ?", strconv.Itoa(periodId)).
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

func (sv BookingService) GetMyBookings(userId, periodId int) []*entity.Booking {
	bookings := []*entity.Booking{}
	res := sv.tx.
		Debug().
		Where("user_id = ? AND booking_period_id = ?", userId, periodId).
		Find(&bookings)

	if res.Error != nil {
		log.Println("shit happen!")
		panic(res.Error)
	}

	return bookings
}
