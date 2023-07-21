package dto

type (
	Register struct {
		FirstName string `json:"firstName"`
		LastName  string `json:"lastName"`
		Email     string `json:"email"`
		Password  string `json:"password"`
	}

	Login struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
)
