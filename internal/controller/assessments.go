package controller

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/truc9/goal/internal/hse"
	"github.com/truc9/goal/internal/utils/httpcontext"
)

type AssessmentController struct {
	assessmentSv hse.AssessmentService
}

func NewAssessmentController(assessmentSv hse.AssessmentService) AssessmentController {
	return AssessmentController{
		assessmentSv: assessmentSv,
	}
}

// Create assessment
//
//	@Summary		Create Assessment
//	@Accept			json
//	@Produce		json
//	@Param			model body		hse.AssessmentModel true "Create Assessment"
//	@Success		200	{object}	uuid.UUID
//	@Router			/api/assessments [post]
func (ctrl AssessmentController) CreateAssessment(c echo.Context) (err error) {
	userId := httpcontext.GetUserId(c)
	model := &hse.AssessmentModel{}
	if err := c.Bind(model); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	result, err := ctrl.assessmentSv.CreateAssessment(userId, model)
	if err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	return c.JSON(http.StatusCreated, result)
}

// Get all assessments
//
//	@Summary		Get all assessments
//	@Accept			json
//	@Produce		json
//	@Success		200	{array}	entity.Booking
//	@Router			/api/asessments [get]
func (ctrl AssessmentController) GetAssessments(c echo.Context) (err error) {
	assessments, err := ctrl.assessmentSv.GetAssessments()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.JSON(http.StatusOK, assessments)
}
