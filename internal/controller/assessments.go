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

// Create Assessment godoc
//
//	@Summary		Create Assessment
//	@Tags			hse
//	@Accept			json
//	@Produce		json
//	@Param			model body		hse.AssessmentModel true "Create Assessment"
//	@Success		200	{object}	uuid.UUID
//	@Router			/api/assessments [post]
func (ctrl *AssessmentController) CreateAssessment(c echo.Context) (err error) {
	userId := httpcontext.GetUserId(c)
	model := &hse.AssessmentModel{}
	if err := c.Bind(model); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	result, _ := ctrl.assessmentSv.CreateAssessment(userId, model)

	return c.JSON(http.StatusCreated, result)
}
