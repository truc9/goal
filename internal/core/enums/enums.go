package enums

type RoleType int

const (
	RoleAdminId   RoleType = 1
	RoleManagerId RoleType = 2
	RoleUserId    RoleType = 3
)

type RoleNameType string

const (
	RoleAdmin   RoleNameType = "admin"
	RoleManager RoleNameType = "manager"
	RoleUser    RoleNameType = "normal_user"
)

type PermissionType int

const (
	Read  PermissionType = 1
	Write PermissionType = 2
)
