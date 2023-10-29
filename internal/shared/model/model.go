package model

import (
	"time"

	"github.com/google/uuid"
)

type (
	BaseModel struct {
		Id          int64     `json:"id"`
		Uid         uuid.UUID `json:"uid"`
		UpdatedBy   int64     `json:"updatedBy"`
		CreatedBy   int64     `json:"createdBy"`
		CreatedDate time.Time `json:"createdDate"`
		UpdatedDate time.Time `json:"updatedDate"`
	}

	PairItem struct {
		Id   int64  `json:"id"`
		Name string `json:"name"`
	}
)
