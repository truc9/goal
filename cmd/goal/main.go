package main

import (
	"net/http"

	jwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/truc9/goal/internal/constants"
	"github.com/truc9/goal/internal/controller"
	"github.com/truc9/goal/internal/iam"
	"github.com/truc9/goal/internal/utils/authz"
)

func main() {

	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Secure())
	e.Use(middleware.RequestID())

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173", "http://*.goal.co.uk"},
		AllowMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))

	e.Static("/", "web/dist")

	iamCtrl := controller.InitIamController()
	periodCtrl := controller.InitPeriodController()
	bookingCtrl := controller.InitBookingController()
	statsService := controller.InitStatsService()

	a := e.Group("api")
	{
		a.POST("/register", iamCtrl.RegisterUser)
		a.POST("/login", iamCtrl.Login)
	}

	r := e.Group("api")
	{
		r.Use(jwt.JWT([]byte(constants.Secret)))

		// periods
		r.POST("/periods", periodCtrl.CreateNextPeriod, authz.RequireRoles(iam.RoleAdmin))
		r.GET("/periods", periodCtrl.GetPeriods, authz.RequireRoles(iam.RoleAdmin, iam.RoleUser))
		r.GET("/periods/next", periodCtrl.GetNextPeriod)
		r.GET("/periods/:bookingPeriodId/my-bookings", bookingCtrl.GetMyBookings)

		// Get booking info of all users
		r.GET("/periods/:bookingPeriodId/bookings", bookingCtrl.GetAllBookings, authz.RequireRoles(iam.RoleAdmin))

		// bookings
		r.POST("/bookings", bookingCtrl.SubmitBooking)
		r.DELETE("/bookings/:bookingId", bookingCtrl.DeleteBooking)

		// stats
		r.GET("/stats/booking-overall", statsService.GetBookingOverallStats)
	}

	e.Logger.Fatal(e.Start(":8000"))
}
