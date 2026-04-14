.PHONY: help dev build lint typecheck check deploy

help: ## Show this help
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

dev: ## Start dev server
	yarn dev

build: ## Production build
	yarn build

lint: ## Run ESLint
	yarn lint

typecheck: ## Run TypeScript type checking
	yarn typecheck

check: lint typecheck build ## Run all checks (lint + typecheck + build)

deploy: ## Trigger production deploy via GitHub Actions
	@echo "This will deploy to production."
	@read -p "Type 'approve' to continue: " confirm && [ "$$confirm" = "approve" ] || { echo "Aborted."; exit 1; }
	gh workflow run deploy
	@echo "Deploy triggered. Watch: gh run watch"
