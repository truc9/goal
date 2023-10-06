package controller

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/truc9/goal/internal/hse"
)

type QuestionController struct {
	questionSv hse.QuestionService
}

func NewQuestionController(questionSv hse.QuestionService) QuestionController {
	return QuestionController{
		questionSv: questionSv,
	}
}

func (ctrl QuestionController) GetByVersion(c echo.Context) error {
	assessmentVersionId, _ := strconv.ParseInt(c.Param("assessmentVersionId"), 10, 64)
	result := ctrl.questionSv.GetAll(assessmentVersionId)
	return c.JSON(http.StatusOK, result)
}

func (ctrl QuestionController) Create(c echo.Context) error {
	model := &hse.QuestionModel{}
	if err := c.Bind(model); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	questionId, err := ctrl.questionSv.Create(model)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusCreated, questionId)
}
