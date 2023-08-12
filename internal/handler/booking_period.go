package handler

import (
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/samber/lo"
	"github.com/tnoss/goal/internal/core"
)

type periodDto struct {
	Id              uuid.UUID          `json:"id"`
	From            time.Time          `json:"from"`
	To              time.Time          `json:"to"`
	Period          core.BookingPeriod `json:"period"`
	IsCurrentPeriod bool               `json:"isCurrentPeriod"`
}

func (h *Handler) CreateNextPeriod(c echo.Context) (err error) {
	period := core.CreateNextBookingPeriod(time.Now())

	existing := &core.BookingPeriod{}
	r := h.DB.Where("\"from\" = ?", period.From).First(&existing)

	if r.RowsAffected != 0 {
		return c.JSON(http.StatusOK, existing)
	}

	res := h.DB.Create(period)
	if res.Error != nil {
		return
	}
	return c.JSON(http.StatusOK, period)
}

func (h *Handler) GetCurrentPeriod(c echo.Context) (err error) {
	period := &core.BookingPeriod{}
	ct := time.Now()
	now := time.Date(ct.Year(), ct.Month(), ct.Day(), 0, 0, 0, 0, time.Local)
	res := h.DB.Where("\"from\" <= ? AND \"to\" >= ?", now, now).First(period)
	if res.Error != nil {
		return c.JSON(http.StatusBadRequest, res.Error)
	}
	return c.JSON(http.StatusOK, period)
}

func (h *Handler) GetPeriods(c echo.Context) (err error) {
	var periods []core.BookingPeriod
	res := h.DB.Find(&periods)
	if res.Error != nil {
		return c.JSON(http.StatusBadRequest, res.Error)
	}

	ct := time.Now()
	now := time.Date(ct.Year(), ct.Month(), ct.Day(), 0, 0, 0, 0, time.Local)

	result := lo.Map(periods, func(item core.BookingPeriod, index int) periodDto {
		return periodDto{
			Id:              item.Id,
			From:            item.From,
			To:              item.To,
			IsCurrentPeriod: item.From.Before(now) && item.To.After(now),
		}
	})

	fmt.Printf("%v", result)

	return c.JSON(http.StatusOK, result)
}
