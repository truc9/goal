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

## Screenshots

![0](art/assets/goal-00.png)

![3](art/assets/goal-04.png)

![2](art/assets/goal-02.png)

![3](art/assets/goal-03.png)


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
- MUI React
- TailwindCSS
- GORM (Postgres)
