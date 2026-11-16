.DEFAULT_GOAL := help

IMAGE ?= admin-vue
TAG ?= local
PORT ?= 8080

.PHONY: help install dev build preview typecheck test test-watch coverage lint format docker-build docker-run clean

help: ## Show available targets
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z0-9_-]+:.*##/ {printf "  %-14s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies from the lockfile
	npm ci

dev: ## Start the Vite dev server
	npm run dev

build: ## Type-check and build the production bundle
	npm run build

preview: ## Preview the production bundle
	npm run preview

typecheck: ## Type-check the project
	npm run type-check

test: ## Run unit tests once
	npm run test:run

test-watch: ## Run unit tests in watch mode
	npm test

coverage: ## Run unit tests with coverage
	npm run test:coverage

lint: ## Lint and auto-fix
	npm run lint

format: ## Format src with Prettier
	npm run format

docker-build: ## Build the multi-stage image (pass VITE_SENTRY_DSN, SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT)
	docker build \
		--build-arg VITE_API_URL \
		--build-arg VITE_SENTRY_DSN \
		--build-arg SENTRY_AUTH_TOKEN \
		--build-arg SENTRY_ORG \
		--build-arg SENTRY_PROJECT \
		--build-arg SENTRY_RELEASE \
		-t $(IMAGE):$(TAG) .

docker-run: ## Serve the image on PORT (default 8080)
	docker run --rm -p $(PORT):80 $(IMAGE):$(TAG)

clean: ## Remove build, coverage, and test output
	rm -rf dist dist-ssr coverage .vitest
