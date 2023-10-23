package controller

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/truc9/goal/internal/hse"
	"github.com/truc9/goal/internal/utils/httpcontext"
	"github.com/truc9/goal/internal/utils/params"
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
func (ct AssessmentController) Create(c echo.Context) (err error) {
	userId := httpcontext.GetUserId(c)
	model := &hse.AssessmentModel{}
	if err := c.Bind(model); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	result, err := ct.assessmentSv.Create(userId, model)
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
func (ct AssessmentController) GetAll(c echo.Context) (err error) {
	assessments, err := ct.assessmentSv.GetAll()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, assessments)
}

// TODO: swagger doc
func (ct AssessmentController) GetAssessmentPairItems(c echo.Context) (err error) {
	items, err := ct.assessmentSv.GetAssessmentPairItems()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, items)
}

// Delete Assessment By ID
//
//	@Summary		Delete Assessment
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	int64
//	@Router			/api/asessments/:assessmentId [delete]
func (ct AssessmentController) Delete(c echo.Context) (err error) {
	assessmentId, _ := strconv.ParseInt(c.Param("assessmentId"), 10, 64)
	deleteError := ct.assessmentSv.Delete(assessmentId)

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
func (ct AssessmentController) GetVersions(c echo.Context) (err error) {
	assessmentId, _ := strconv.ParseInt(c.Param("assessmentId"), 10, 64)
	versions, _ := ct.assessmentSv.GetVersions(assessmentId)
	return c.JSON(http.StatusOK, versions)
}

// Update single assessment
//
// @Summary		Update Assessment
// @Produce 	json
// @Router 		/api/assessments/:assessmentId [put]
func (ct AssessmentController) Update(c echo.Context) (err error) {
	id := params.GetIntParam(c, "assessmentId")
	userId := httpcontext.GetUserId(c)
	model := &hse.AssessmentModel{}

	if err := c.Bind(&model); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	model.UpdatedBy = userId

	err = ct.assessmentSv.Update(id, model)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, nil)
}
