on:
	docker-compose -f ./devops/dev/docker-compose.yml up -d
off:
	docker-compose -f ./devops/dev/docker-compose.yml down -v
restart:
	docker-compose -f ./devops/dev/docker-compose.yml restart
build:
	docker-compose -f ./devops/dev/docker-compose.yml build
logs:
	docker-compose -f ./devops/dev/docker-compose.yml logs -f
attach:
	docker  attach notifier-backend-container
