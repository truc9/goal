package controller

import (
	"log"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/truc9/goal/internal/hse"
	"github.com/truc9/goal/internal/utils/params"
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
	result := ct.questionSv.GetByVersion(assessmentVersionId)
	return c.JSON(http.StatusOK, result)
}

func (ct QuestionController) Create(c echo.Context) error {
	model := &hse.QuestionModel{}
	if err := c.Bind(model); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	questionId, err := ct.questionSv.Create(model)
	if err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	return c.JSON(http.StatusCreated, questionId)
}

func (ct QuestionController) Delete(c echo.Context) error {
	questionId, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	err := ct.questionSv.Delete(questionId)
	if err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	return c.JSON(http.StatusOK, nil)
}

func (ct QuestionController) UpdateOrdinal(c echo.Context) error {
	questionId := params.GetIntParam(c, "id")
	model := &hse.UpdateOrdinalModel{}
	if err := c.Bind(&model); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	log.Printf("%v-%v", questionId, model.DestinationQuestionId)

	err := ct.questionSv.UpdateOrdinal(questionId, model.DestinationQuestionId)
	if err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	return c.JSON(http.StatusOK, nil)
}
