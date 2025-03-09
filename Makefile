.PHONY: all tidy migrate fmt serve webapp build run clean dev

# Variables
BIN_NAME := yeahnah
BUILD_FOLDER := ./.out
VERSION := $(shell cat ./VERSION)

# Default target
all: build

tidy:
	go mod tidy

migrate:
	go run ./ migrate

fmt:
	go fmt ./... && templ fmt .

serve:
	./.out/${BIN_NAME} serve --help


webapp:
	mkdir -p ${BUILD_FOLDER}
	(cd ./webapp && npm run build)
	cp -r ./webapp/dist "${BUILD_FOLDER}/public"

build: clean webapp
	go build -o ${BUILD_FOLDER}/${BIN_NAME} ./

run:
	go run ./ serve

clean:
	rm -rf ${BUILD_FOLDER}

dev:
	AIR_ENABLED=1 ENV=dev go run github.com/air-verse/air@latest serve
