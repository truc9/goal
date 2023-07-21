package model

import "github.com/google/uuid"

type Account struct {
	ID            uuid.UUID `json:"id"`
	FirstName     string    `json:"firstName"`
	LastName      string    `json:"lastName"`
	CompanyName   string    `json:"companyName"`
	Address       string    `json:"address"`
	Email         string    `json:"email"`
	ContactNumber string    `json:"contactNumber"`
}

func (acc *Account) UpdateContact(email, contactNumber string) {
	acc.Email = email
	acc.ContactNumber = contactNumber
}
