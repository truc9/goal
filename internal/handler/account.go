package handler

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/tnoss/goal/internal/core"
)

func (h *Handler) GetAll(c echo.Context) (err error) {
	var accounts []core.Account
	h.DB.Find(&accounts)
	return c.JSON(http.StatusOK, accounts)
}

func (h *Handler) CreateCompanyAccount(c echo.Context) (err error) {
	acc := &core.Account{
		Id: uuid.New(),
	}

	if err = c.Bind(acc); err != nil {
		return
	}

	res := h.DB.Create(acc)
	return res.Error
}

func (h *Handler) CreateIndividualAccount(c echo.Context) (err error) {
	acc := &core.Account{
		Id: uuid.New(),
	}

	if err = c.Bind(acc); err != nil {
		return
	}

	res := h.DB.Create(acc)

	if res.Error != nil {
		return
	}
	return c.JSON(http.StatusCreated, acc)
}
