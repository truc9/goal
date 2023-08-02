package main

import (
	"net/http"

	jwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/tnoss/goal/internal/constants"
	"github.com/tnoss/goal/internal/db"
	"github.com/tnoss/goal/internal/handler"
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

	db := db.Init()

	h := &handler.Handler{
		Db: db,
	}

	a := e.Group("api")
	{
		a.POST("/register", h.RegisterUser)
		a.POST("/login", h.Login)
	}

	r := e.Group("api")
	{
		r.Use(jwt.JWT([]byte(constants.Secret)))
		r.GET("/accounts", h.GetAll)
		r.POST("/accounts/companies", h.CreateCompanyAccount)
		r.POST("/accounts/individuals", h.CreateIndividualAccount)
		r.GET("/streaming", h.Streaming)
		r.GET("/ws", h.HandleWS)

		r.POST("/periods", h.CreatePeriod)
		r.GET("/periods", h.GetPeriods)
		r.GET("/periods/current", h.GetCurrentPeriod)
		r.GET("/periods/:bookingPeriodId/bookings", h.GetUserBookingsByPeriods)

		r.POST("/bookings", h.SubmitBooking)
		r.DELETE("/bookings/:bookingId", h.DeleteBooking)

	}

	e.Logger.Fatal(e.Start(":8000"))
}
