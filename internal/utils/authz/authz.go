package authz

import (
	"fmt"

	"github.com/labstack/echo/v4"
	"github.com/samber/lo"
	"github.com/truc9/goal/internal/core/enums"
	"github.com/truc9/goal/internal/utils/httpcontext"
)

func RequireRoles(roleTypes ...enums.RoleNameType) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			role := httpcontext.GetUserRole(c)
			if lo.Contains(roleTypes, enums.RoleNameType(role)) {
				fmt.Printf("Authorized role %s successfully\n", role)
				return next(c)
			}
			return echo.ErrUnauthorized
		}
	}
}
