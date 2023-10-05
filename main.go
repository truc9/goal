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
	app.Logger.SetLevel(log.ERROR)

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

	scheduler := di.GetScheduler()
	iamCtrl := di.GetIAMCtrl()
	periodCtrl := di.GetPeriodCtrl()
	bookingCtrl := di.GetBookingCtrl()
	statCtrl := di.GetStatCtrl()
	websocketCtrl := di.GetWebsocketCtrl()
	assessmentCtrl := di.GetAssessmentCtrl()

	// init & run hub in a different go routine
	hub := ws.NewHub()
	go hub.Run()

	// run schedule in a differnt go routine
	go scheduler.Run()

	app.GET("/ws", func(c echo.Context) error {
		log.Print("websocket connected")
		websocketCtrl.ServeWS(c, hub)
		return nil
	})

	anonymous := app.Group("api")
	{
		anonymous.POST("/register", iamCtrl.RegisterUser)
		anonymous.POST("/login", iamCtrl.Login)
	}

	api := app.Group("api")
	{
		api.Use(jwt.JWT([]byte(config.Secret)))

		// Booking Periods
		api.POST("/periods", periodCtrl.CreateNextPeriod, authz.RequireRoles(entity.RoleAdmin))
		api.GET("/periods", periodCtrl.GetPeriods, authz.RequireRoles(entity.RoleAdmin, entity.RoleUser))
		api.GET("/periods/next", periodCtrl.GetNextPeriod)
		api.GET("/periods/:bookingPeriodId/my-bookings", bookingCtrl.GetMyBookings)
		api.GET("/periods/:bookingPeriodId/bookings", bookingCtrl.GetBookings, authz.RequireRoles(entity.RoleAdmin))

		// Bookings
		api.POST("/bookings", bookingCtrl.Submit)
		api.DELETE("/bookings/:bookingId", bookingCtrl.Delete)

		// Stats & Analytics
		api.GET("/stats/booking-overall", statCtrl.GetBookingStats)

		// HSE Assessments
		api.GET("/assessments", assessmentCtrl.GetAll)
		api.POST("/assessments", assessmentCtrl.Create)
		api.DELETE("/assessments/:assessmentId", assessmentCtrl.Delete)
		api.GET("/assessments/:assessmentId/versions", assessmentCtrl.GetVersions)
	}

	app.Logger.Fatal(app.Start(":8000"))
}
