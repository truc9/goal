package enums

type RoleType int

const (
	Admin   RoleType = 1
	Manager RoleType = 2
	User    RoleType = 3
)

type PermissionType int

const (
	Read  PermissionType = 1
	Write PermissionType = 2
)
