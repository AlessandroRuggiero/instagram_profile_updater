.PHONY: run

run:
	@echo "Running main.js"
	node main.js

build:
	@echo "Building main.js"
	docker build -t instagram_profile_updater .

run-docker:
	@echo "Running main.js in docker"
	docker run -it --env-file=./.env instagram_profile_updater

run-docker-dev: build
	@echo "Running main.js in docker"
	docker run -it --env-file ./.env instagram_profile_updater