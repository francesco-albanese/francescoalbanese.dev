SHELL := /bin/bash

.DEFAULT_GOAL := help

dev: ## start dev server
	pnpm dev

build: ## build for production
	pnpm build

preview: ## preview production build
	pnpm preview

lint: ## run astro check
	pnpm check

deploy: build ## build + sync to S3 + invalidate CloudFront
	aws s3 sync dist/ s3://$(S3_BUCKET) --delete
	aws cloudfront create-invalidation --distribution-id $(CF_DISTRIBUTION_ID) --paths "/index.html" "/"

help: ## show this help message
	@grep -hE '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | uniq | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[32m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: dev build preview lint deploy help
