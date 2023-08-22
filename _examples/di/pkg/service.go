package pkg

import (
	"fmt"
	"math/rand"
)

type Student struct {
	Score int
}

type SchoolFeeExempt struct {
	RequireScore int
}

type StudentEligibilityService struct {
	St  Student
	Sfe SchoolFeeExempt
}

func (s StudentEligibilityService) Check() (bool, string) {
	if s.St.Score < s.Sfe.RequireScore {
		return false, fmt.Sprintf("Missing %d score\n", s.Sfe.RequireScore-s.St.Score)
	}
	return true, ""
}

func NewStudent() Student {
	return Student{Score: rand.Intn(100)}
}

func NewSchoolFeeExempt(foo Student) SchoolFeeExempt {
	return SchoolFeeExempt{RequireScore: rand.Intn(100)}
}

func NewService(s Student, sf SchoolFeeExempt) StudentEligibilityService {
	return StudentEligibilityService{
		St:  s,
		Sfe: sf,
	}
}
