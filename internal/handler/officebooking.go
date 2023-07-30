package handler

import (
	"github.com/labstack/echo/v4"
	"github.com/tnoss/goal/internal/entity"
)

func (h *Handler) bookGoToOffice(c echo.Context) (err error) {
	model := &entity.OfficeBooking{}
	if err = c.Bind(model); err != nil {
		return
	}
	return nil
}
