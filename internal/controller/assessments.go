package controller

import (
	"net/http"
	"strconv"

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
func (ctrl AssessmentController) Create(c echo.Context) (err error) {
	userId := httpcontext.GetUserId(c)
	model := &hse.AssessmentModel{}
	if err := c.Bind(model); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	result, err := ctrl.assessmentSv.CreateAssessment(userId, model)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
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
func (ctrl AssessmentController) GetAll(c echo.Context) (err error) {
	assessments, err := ctrl.assessmentSv.GetAssessments()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, assessments)
}

// Delete Assessment By ID
//
//	@Summary		Delete Assessment
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	int64
//	@Router			/api/asessments/:assessmentId [delete]
func (ctrl AssessmentController) Delete(c echo.Context) (err error) {
	assessmentId, _ := strconv.ParseInt(c.Param("assessmentId"), 10, 64)
	deleteError := ctrl.assessmentSv.DeleteAssessment(assessmentId)

	if deleteError != nil {
		return c.JSON(http.StatusInternalServerError, deleteError)
	}
	return c.JSON(http.StatusOK, assessmentId)
}

// Get verions by assessment id
//
//	@Summary		Get versions
//	@Produce		json
//	@Success		200	{object}	[]hse.AssessmentVersionModel
//	@Router			/api/asessments/:assessmentId/versions [get]
func (ctrl AssessmentController) GetVersions(c echo.Context) (err error) {
	assessmentId, _ := strconv.ParseInt(c.Param("assessmentId"), 10, 64)
	versions, _ := ctrl.assessmentSv.GetAssessmentVersions(assessmentId)
	return c.JSON(http.StatusOK, versions)
}
