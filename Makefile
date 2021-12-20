SHELL=bash
.ONESHELL:

MAKEFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
##########################
IMAGE_NAME=rug-frontend

PWD := $(shell (dirname $(MAKEFILE_PATH)))
##############
all: run

run: docker.build 
	docker run -ti \
		--rm \
		--name $(IMAGE_NAME) \
		-v $(PWD):/app \
		-p 127.0.0.1:3010:3000 \
		$(IMAGE_NAME)

docker.build:
	docker build \
		--no-cache \
		$(PWD) \
		-f .docker/Dockerfile \
		-t $(IMAGE_NAME):latest

