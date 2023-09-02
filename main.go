package main

import (
	"fmt"
	"net/http"

	jwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	echoSwagger "github.com/swaggo/echo-swagger"
	_ "github.com/truc9/goal/docs"
	"github.com/truc9/goal/internal/config"
	"github.com/truc9/goal/internal/di"
	"github.com/truc9/goal/internal/iam"
	"github.com/truc9/goal/internal/utils/authz"
)

// @title GOAL Swagger API
// @version 1.0
// @description This is a simple office management REST API.

// @contact.name Support
// @contact.email truchjkl@gmail.com

// @license.name MIT License
// @license.url http://github.com/truc9/goal/LICENSE

// @BasePath /api
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
	e.GET("/swagger/*", echoSwagger.WrapHandler)

	iamController := di.InitIamController()
	periodController := di.InitPeriodController()
	bookingController := di.InitBookingController()
	statsService := di.InitStatsService()
	scheduler := di.InitScheduler()

	fmt.Println("starting scheduler...")
	go scheduler.Execute()
	fmt.Println("started scheduler...")

	a := e.Group("api")
	{
		a.POST("/register", iamController.RegisterUser)
		a.POST("/login", iamController.Login)
	}

	r := e.Group("api")
	{
		r.Use(jwt.JWT([]byte(config.Secret)))

		// periods
		r.POST("/periods", periodController.CreateNextPeriod, authz.RequireRoles(iam.RoleAdmin))
		r.GET("/periods", periodController.GetPeriods, authz.RequireRoles(iam.RoleAdmin, iam.RoleUser))
		r.GET("/periods/next", periodController.GetNextPeriod)
		r.GET("/periods/:bookingPeriodId/my-bookings", bookingController.GetMyBookings)

		// Get booking info of all users
		r.GET("/periods/:bookingPeriodId/bookings", bookingController.GetAllBookings, authz.RequireRoles(iam.RoleAdmin))

		// bookings
		r.POST("/bookings", bookingController.SubmitBooking)
		r.DELETE("/bookings/:bookingId", bookingController.DeleteBooking)

		// stats
		r.GET("/stats/booking-overall", statsService.GetBookingOverallStats)
	}

	e.Logger.Fatal(e.Start(":8000"))
}
