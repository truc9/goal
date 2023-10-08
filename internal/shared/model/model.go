package model

type BaseModel struct {
	UpdatedBy int64 `json:"updatedBy"`
	CreatedBy int64 `json:"createdBy"`
}
