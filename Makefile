
test:
	go test ./...

test_cov:
	go test ./... -coverprofile=coverage.out
	go tool cover -html=coverage.out

build:
	go build ./cmd/goal/main.go

dev:
	go run ./cmd/goal/main.go