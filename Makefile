
test:
	go test ./...

test_cov:
	go test ./... -coverprofile=coverage.out
	go tool cover -html=coverage.out

build:
	go build ./cmd/goal/main.go

wire:
	cd internal/di && wire

run:
	go run ./cmd/goal/main.go

doc:
	swag init -pd -g main.go