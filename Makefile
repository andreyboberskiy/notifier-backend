up:
	docker-compose -f ./devops/dev/docker-compose.yml up -d
down:
	docker-compose -f ./devops/dev/docker-compose.yml down -v
restart:
	docker-compose -f ./devops/dev/docker-compose.yml restart
build:
	docker-compose -f ./devops/dev/docker-compose.yml build
logs:
	docker-compose -f ./devops/dev/docker-compose.yml logs -f notifier
attach:
	docker  attach notifier-backend-container
