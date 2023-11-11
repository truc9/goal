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

	app.Use(middleware.Secure())
	app.Use(middleware.RequestID())
	app.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173", "http://*.goal.co.uk", "https://getgoal.vercel.app"},
		AllowMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))

	app.Static("/", "web/dist")
	app.GET("/swagger/*", sg.WrapHandler)
	// app.GET("/metrics", echoprometheus.NewHandler())

	scheduler := di.GetScheduler()
	iamController := di.GetIamController()
	periodController := di.GetPeriodController()
	bookingController := di.GetBookingController()
	statsController := di.GetStatController()
	wsController := di.GetWSController()
	assessmentController := di.GetAssessmentController()
	questionController := di.GetQuestionController()
	employeeController := di.GetEmployeeController()

	// init & run hub in a different go routine
	hub := ws.NewHub()
	go hub.Run()

	// run schedule in a differnt go routine
	go scheduler.Run()

	app.GET("/ws", func(c echo.Context) error {
		wsController.ServeWS(c, hub)
		return nil
	})

	app.GET("/hc", func(c echo.Context) error {
		return c.JSON(http.StatusOK, "Good")
	})

	anonymous := app.Group("api")
	{
		anonymous.POST("/register", iamController.RegisterUser)
		anonymous.POST("/login", iamController.Login)
	}

	api := app.Group("api")
	{
		api.Use(jwt.JWT([]byte(config.Secret)))

		// Booking Periods
		api.POST("/periods", periodController.CreateNextPeriod, authz.RequireRoles(entity.RoleAdmin))
		api.GET("/periods", periodController.GetPeriods, authz.RequireRoles(entity.RoleAdmin, entity.RoleUser))
		api.GET("/periods/next", periodController.GetNextPeriod)
		api.GET("/periods/:bookingPeriodId/my-bookings", bookingController.GetMyBookings)
		api.GET("/periods/:bookingPeriodId/bookings", bookingController.GetBookings, authz.RequireRoles(entity.RoleAdmin))

		// Bookings
		api.POST("/bookings", bookingController.Submit)
		api.DELETE("/bookings/:bookingId", bookingController.Delete)

		// Stats & Analytics
		api.GET("/stats/booking-overall", statsController.GetBookingStats)
		api.GET("/stats/booking-per-periods", statsController.GetBookingPerPeriodStats)
		api.GET("/stats/my-assignments/count", statsController.GetMyAssignmentCount)

		// HSE Assessments
		api.GET("/assessments", assessmentController.GetAll)
		api.GET("/assessments/pair-items", assessmentController.GetAssessmentPairItems)
		api.POST("/assessments", assessmentController.Create)
		api.PUT("/assessments/:assessmentId", assessmentController.Update)
		api.DELETE("/assessments/:assessmentId", assessmentController.Delete)
		api.GET("/assessments/:assessmentId/versions", assessmentController.GetVersions)
		api.GET("/assessments/versions/:assessmentVersionId/questions", questionController.GetByVersion)
		api.POST("/assessments/questions", questionController.Create)
		api.DELETE("/assessments/questions/:id", questionController.Delete)
		api.PUT("/assessments/questions/:id/ordinal", questionController.UpdateOrdinal)

		// Assignments
		api.PUT("/assignments/versions/:versionId/assign", assessmentController.Assign)
		api.PUT("/assignments/versions/:versionId/unassign", assessmentController.Unassign)
		api.PUT("/assignments/:assignmentId/start", assessmentController.StartAssessment)
		api.POST("/assignments/:assigmentId/submit", assessmentController.SubmitQuestionAnswer)

		// Users & Employees
		api.GET("/employees", employeeController.GetAll)
		api.GET("/employees/my-assignments", employeeController.GetMyAssignments)
		api.GET("/employees/:userId/assignments", assessmentController.GetAssignments)
		api.PUT("/employees/:userId/employee-numbers", employeeController.AllocEmployeeNumber)
		api.PUT("/employees/:userId/activate", employeeController.Activate)
		api.PUT("/employees/:userId/deactivate", employeeController.Deactivate)
		api.POST("/employees/import", employeeController.Import)
	}

	app.Logger.Fatal(app.Start(":8000"))
}
