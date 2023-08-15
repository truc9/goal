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
	Id              uuid.UUID `json:"id"`
	From            time.Time `json:"from"`
	To              time.Time `json:"to"`
	IsCurrentPeriod bool      `json:"isCurrentPeriod"`
}

func (h *Handler) CreateNextPeriod(c echo.Context) (err error) {
	period := core.CreateNextPeriod(time.Now())

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

func (h *Handler) GetNextPeriod(c echo.Context) (err error) {
	period := &core.BookingPeriod{}
	todayNextWeek := core.GetTodayNextWeek(time.Now())
	res := h.DB.Where("\"from\" <= ? AND \"to\" >= ?", todayNextWeek, todayNextWeek).First(period)
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

	todayNextWeek := core.GetTodayNextWeek(time.Now())
	fmt.Println(todayNextWeek)

	result := lo.Map(periods, func(item core.BookingPeriod, index int) periodDto {
		return periodDto{
			Id:              item.Id,
			From:            item.From,
			To:              item.To,
			IsCurrentPeriod: item.From.Before(todayNextWeek) && item.To.After(todayNextWeek),
		}
	})

	fmt.Printf("%v", result)

	return c.JSON(http.StatusOK, result)
}
