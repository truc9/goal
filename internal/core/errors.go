package core

type Errors struct {
	Message string `json:"message"`
}

// Create error with error object
func CreateError(err error) *Errors {
	return &Errors{
		Message: err.Error(),
	}
}

// Create error with error messasge
func Create(message string) *Errors {
	return &Errors{
		Message: message,
	}
}
