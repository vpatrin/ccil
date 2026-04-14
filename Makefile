.PHONY: help deploy

help: ## Show this help
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

deploy: ## Trigger production deploy via GitHub Actions
	@echo "This will deploy to production."
	@read -p "Type 'approve' to continue: " confirm && [ "$$confirm" = "approve" ] || { echo "Aborted."; exit 1; }
	gh workflow run deploy
	@echo "Deploy triggered. Watch: gh run watch"
