package authz

import (
	"log"

	"github.com/labstack/echo/v4"
	"github.com/samber/lo"
	"github.com/truc9/goal/internal/iam"
	"github.com/truc9/goal/internal/utils/httpcontext"
)

func RequireRoles(roleTypes ...iam.RoleNameType) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			role := httpcontext.GetUserRole(c)
			if lo.Contains(roleTypes, iam.RoleNameType(role)) {
				return next(c)
			}
			log.Println("[ERROR] Unauthorized")
			return echo.ErrUnauthorized
		}
	}
}
