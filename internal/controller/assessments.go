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
//	@Tags			Assessments
//	@Accept			json
//	@Produce		json
//	@Param			model body		hse.AssessmentModel true "Create Assessment"
//	@Success		200	{object}	uuid.UUID
//	@Router			/api/assessments [POST]
func (ct AssessmentController) Create(c echo.Context) (err error) {
	userId := httpcontext.CurrentUserId(c)
	model := &hse.AssessmentModel{}
	if err := c.Bind(model); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	result, err := ct.assessmentSv.Create(userId, model)
	if err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	return c.JSON(http.StatusCreated, result)
}

// Get all assessments
//
//	@Summary		Get all assessments
//	@Tags			Assessments
//	@Accept			json
//	@Produce		json
//	@Success		200	{array}	entity.Booking
//	@Router			/api/asessments [GET]
func (ct AssessmentController) GetAll(c echo.Context) (err error) {
	assessments, err := ct.assessmentSv.GetAll()
	if err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	return c.JSON(http.StatusOK, assessments)
}

// GetAssessmentPairItems
//
//	@Summary		GetAssessmentPairItems
//	@Tags			Assessments
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	int64
//	@Router			/api/asessments/pair-items [GET]
func (ct AssessmentController) GetAssessmentPairItems(c echo.Context) (err error) {
	items, err := ct.assessmentSv.GetAssessmentPairItems()
	if err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	return c.JSON(http.StatusOK, items)
}

// Delete Assessment By ID
//
//	@Summary		Delete Assessment
//	@Tags			Assessments
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	int64
//	@Router			/api/asessments/:assessmentId [DELETE]
func (ct AssessmentController) Delete(c echo.Context) error {
	assessmentId, _ := strconv.ParseInt(c.Param("assessmentId"), 10, 64)
	deleteError := ct.assessmentSv.Delete(assessmentId)

	if deleteError != nil {
		return c.JSON(http.StatusBadRequest, deleteError)
	}
	return c.JSON(http.StatusOK, assessmentId)
}

// Get verions by assessment id
//
//	@Summary		Get versions
//	@Tags			Assessments
//	@Produce		json
//	@Success		200	{object}	[]hse.AssessmentVersionModel
//	@Router			/api/asessments/:assessmentId/versions [GET]
func (ct AssessmentController) GetVersions(c echo.Context) error {
	assessmentId, _ := strconv.ParseInt(c.Param("assessmentId"), 10, 64)
	versions, _ := ct.assessmentSv.GetVersions(assessmentId)
	return c.JSON(http.StatusOK, versions)
}

// Update single assessment
//
// @Summary		Update Assessment
// @Tags		Assessments
// @Produce 	json
// @Router 		/api/assessments/:assessmentId [PUT]
func (ct AssessmentController) Update(c echo.Context) error {
	id := params.GetIntParam(c, "assessmentId")
	userId := httpcontext.CurrentUserId(c)
	model := &hse.AssessmentModel{}

	if err := c.Bind(&model); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	model.UpdatedBy = userId

	err := ct.assessmentSv.Update(id, model)

	if err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	return c.JSON(http.StatusOK, nil)
}

// Assign
//
//	@Summary		Assign
//	@Tags			Assessments
//	@Accept			json
//	@Produce		json
//	@Param			model body		hse.AssignmentModel true "AssignmentModel"
//	@Success		200
//	@Router			/api/assignments/:versionId/assign [PUT]
func (ct AssessmentController) Assign(c echo.Context) error {
	versionId := params.GetIntParam(c, "versionId")
	model := &hse.AssignmentModel{}

	if err := c.Bind(model); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	err := ct.assessmentSv.Assign(model.UserId, versionId)
	if err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	return c.JSON(http.StatusCreated, nil)
}

// Unassign
//
//	@Summary		Unassign
//	@Tags			Assessments
//	@Accept			json
//	@Produce		json
//	@Param			model body		hse.AssignmentModel true "Assign"
//	@Success		200
//	@Router			/api/assignments/:versionId/unassign [PUT]
func (ct AssessmentController) Unassign(c echo.Context) error {
	versionId := params.GetIntParam(c, "versionId")
	model := &hse.AssignmentModel{
		VersionId: versionId,
	}

	if err := c.Bind(model); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	err := ct.assessmentSv.Unassign(model.UserId, versionId)

	if err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	return c.JSON(http.StatusCreated, nil)
}

// GetAssignments
//
//	@Summary		GetAssignments
//	@Tags			Assessments
//	@Accept			json
//	@Produce		json
//	@Success		200
//	@Router			/api/assignments [GET]
func (ct AssessmentController) GetAssignments(c echo.Context) error {
	userId := httpcontext.CurrentUserId(c)
	result := ct.assessmentSv.GetAssignments(userId)
	return c.JSON(http.StatusOK, result)
}

func (ct AssessmentController) StartAssessment(c echo.Context) error {
	userId := httpcontext.CurrentUserId(c)
	assignmentId := params.GetIntParam(c, "assignmentId")
	ct.assessmentSv.StartAssessment(userId, assignmentId)
	return c.JSON(http.StatusOK, nil)
}

func (ct AssessmentController) SubmitQuestionAnswer(c echo.Context) error {
	userId := httpcontext.CurrentUserId(c)

	var model struct {
		AssignmentId int64 `json:"assignmentId"`
		QuestionId   int64 `json:"questionId"`
		AnswerId     int64 `json:"answerId"`
	}
	if err := c.Bind(&model); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	ct.assessmentSv.SubmitQuestionAnswer(model.AssignmentId, model.QuestionId, model.AnswerId)
	return c.JSON(http.StatusOK, userId)
}
