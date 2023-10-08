package params

import (
	"strconv"

	"github.com/labstack/echo/v4"
)

func GetIntParam(c echo.Context, param string) int64 {
	result, err := strconv.ParseInt(c.Param(param), 10, 64)
	if err != nil {
		panic(err)
	}
	return result
}
