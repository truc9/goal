package iam

type (
	RegisterModel struct {
		FirstName string `json:"firstName"`
		LastName  string `json:"lastName"`
		Email     string `json:"email"`
		UserName  string `json:"username"`
		Password  string `json:"password"`
	}

	RoleAssignmentModel struct {
		RoleId int `json:"roleId"`
	}

	LoginModel struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	LoginResult struct {
		Id     int    `json:"id"`
		Email  string `json:"email"`
		Name   string `json:"name"`
		Role   string `json:"role"`
		Expire int64  `json:"expire"`
		Token  string `json:"token"`
	}

	UserModel struct {
		Id        int    `json:"id"`
		FirstName string `json:"firstName"`
		LastName  string `json:"lastName"`
		Email     string `json:"email"`
	}
)
