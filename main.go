package main

import (
	"net/http"

	jwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
	sg "github.com/swaggo/echo-swagger"
	_ "github.com/truc9/goal/docs"
	"github.com/truc9/goal/internal/config"
	"github.com/truc9/goal/internal/di"
	"github.com/truc9/goal/internal/entity"
	"github.com/truc9/goal/internal/utils/authz"
	"github.com/truc9/goal/internal/ws"
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
	app := echo.New()
	app.Logger.SetLevel(log.INFO)

	// app.Use(echoprometheus.NewMiddleware("monitoring"))
	app.Use(middleware.Secure())
	app.Use(middleware.RequestID())
	app.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173", "http://*.goal.co.uk"},
		AllowMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))

	app.Static("/", "web/dist")
	app.GET("/swagger/*", sg.WrapHandler)
	// app.GET("/metrics", echoprometheus.NewHandler())

	scheduler := di.InitScheduler()
	iamCtrl := di.InitIamController()
	periodCtrl := di.InitPeriodController()
	bookingCtrl := di.InitBookingController()
	statCtrl := di.InitStatController()
	wsCtrl := di.InitWsController()

	// init & run hub in a different go routine
	hub := ws.NewHub()
	go hub.Run()

	// run schedule in a differnt go routine
	go scheduler.Run()

	app.GET("/ws", func(c echo.Context) error {
		wsCtrl.ServeWS(c, hub)
		return nil
	})

	a := app.Group("api")
	{
		a.POST("/register", iamCtrl.RegisterUser)
		a.POST("/login", iamCtrl.Login)
	}

	r := app.Group("api")
	{
		r.Use(jwt.JWT([]byte(config.Secret)))

		// periods
		r.POST("/periods", periodCtrl.CreateNextPeriod, authz.RequireRoles(entity.RoleAdmin))
		r.GET("/periods", periodCtrl.GetPeriods, authz.RequireRoles(entity.RoleAdmin, entity.RoleUser))
		r.GET("/periods/next", periodCtrl.GetNextPeriod)
		r.GET("/periods/:bookingPeriodId/my-bookings", bookingCtrl.GetMyBookings)

		// Get booking info of all users
		r.GET("/periods/:bookingPeriodId/bookings", bookingCtrl.GetAllBookings, authz.RequireRoles(entity.RoleAdmin))

		// bookings
		r.POST("/bookings", bookingCtrl.SubmitBooking)
		r.DELETE("/bookings/:bookingId", bookingCtrl.DeleteBooking)

		// stats
		r.GET("/stats/booking-overall", statCtrl.GetBookingOverallStats)

	}

	app.Logger.Fatal(app.Start(":8000"))
}
