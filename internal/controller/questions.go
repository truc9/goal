package controller

import (
	"log"
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

func (ct QuestionController) GetByVersion(c echo.Context) error {
	assessmentVersionId, _ := strconv.ParseInt(c.Param("assessmentVersionId"), 10, 64)
	result := ct.questionSv.GetAll(assessmentVersionId)
	return c.JSON(http.StatusOK, result)
}

func (ct QuestionController) Create(c echo.Context) error {
	model := &hse.QuestionModel{}
	if err := c.Bind(model); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	log.Println(model)

	questionId, err := ct.questionSv.Create(model)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusCreated, questionId)
}

func (ct QuestionController) Delete(c echo.Context) error {
	questionId, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	err := ct.questionSv.Delete(questionId)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, nil)
}
