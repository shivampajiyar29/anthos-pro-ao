.PHONY: up down build logs shell-api migrate seed test

up:
	docker-compose up -d

down:
	docker-compose down

build:
	docker-compose build

logs:
	docker-compose logs -f

shell-api:
	docker-compose exec api /bin/bash

migrate:
	docker-compose exec api alembic upgrade head

seed:
	docker-compose exec api python scripts/seed.py

test:
	docker-compose exec api pytest tests/
