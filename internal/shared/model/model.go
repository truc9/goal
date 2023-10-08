package model

import "github.com/google/uuid"

type BaseModel struct {
	Id        int64     `json:"id"`
	Uid       uuid.UUID `json:"uid"`
	UpdatedBy int64     `json:"updatedBy"`
	CreatedBy int64     `json:"createdBy"`
}
