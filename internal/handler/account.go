package handler

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/tnoss/goal/internal/model"
)

func (h *Handler) GetAll(c echo.Context) (err error) {
	var accounts []model.Account
	h.Db.Find(&accounts)
	return c.JSON(http.StatusOK, accounts)
}

func (h *Handler) CreateCompanyAccount(c echo.Context) (err error) {
	acc := &model.Account{
		ID: uuid.New(),
	}

	if err = c.Bind(acc); err != nil {
		return
	}

	res := h.Db.Create(acc)
	return res.Error
}

func (h *Handler) CreateIndividualAccount(c echo.Context) (err error) {
	acc := &model.Account{
		ID: uuid.New(),
	}

	if err = c.Bind(acc); err != nil {
		return
	}

	res := h.Db.Create(acc)

	if res.Error != nil {
		return
	}
	return c.JSON(http.StatusCreated, acc)
}
