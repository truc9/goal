package entity

import (
	"fmt"
)

type DomainError struct {
	message string
}

func NewDomainError(code, message string) *DomainError {
	return &DomainError{
		message: message,
	}
}

func (e *DomainError) Error() string {
	return fmt.Sprintf("[Business Error] %s", e.message)
}
