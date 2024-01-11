<img src="art/logo-color.svg" alt="drawing" style="width:200px;"/>

Simple Office Management System

*⚠️ This project for learning purpose*

[![CodeQL](https://github.com/truc9/goal/actions/workflows/codeql.yml/badge.svg)](https://github.com/truc9/goal/actions/workflows/codeql.yml)

[![Go](https://github.com/truc9/goal/actions/workflows/go.yml/badge.svg)](https://github.com/truc9/goal/actions/workflows/go.yml)

## Planning
- [x] Local DB AuthN
- [x] My Booking
- [x] Booking Dashboard
- [x] Role-based AuthZ
- [x] Realtime Update for Dashboard
- [x] Charts for Dashboard
- [ ] Testing

## Demo
- Username: admin@goal.com
- Password: admin

## Hosting
- Backend: https://www.fl0.com/
- Frontend: https://vercel.com/

## Screenshots

![3](art/assets/2.png)

![2](art/assets/3.png)

![3](art/assets/4.png)

![5](art/assets/6.png)

![6](art/assets/7.png)

## Development

### Swagger API
```
http://localhost:8000/swagger/index.html#/
```
![0](art/assets/goal-swagger.png)

### Environment Variable
```
<!-- For signing JWT token -->
SECRET_KEY=
```

### Start API (hot reload)
```
air
```

### Start API (without hotreload)
```
make run
```

### Create Migration
```
migrate create -ext sql -dir "./migrations" -seq create_users_table
```

### Run Migration
```
migrate -database "postgres://postgres:admin@localhost:5432/goal?sslmode=disable" -path "./migrations" up
```

### Start web
```
cd ./web && pnpm dev
```

### Run tests with coverage
```
make test_cov
```
### Go Notes
- Go does not support default parameter
- Go does not support overload (https://go.dev/doc/faq#overloading)

## Stack
- Go
- React
- [MUI React](https://mui.com)
- [TailwindCSS](https://tailwindcss.com)
- [GORM (Postgres)](https://gorm.io)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
