//go:build wireinject
// +build wireinject

package main

import (
	"github.com/google/wire"
	"github.com/truc9/goal/_examples/di/pkg"
)

func InitializeService() (pkg.StudentEligibilityService, error) {
	wire.Build(pkg.NewService, pkg.NewSchoolFeeExempt, pkg.NewStudent)
	return pkg.StudentEligibilityService{}, nil
}
