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
devops-to-prod:
	scp -i /Users/andreyboberskiy/.ssh/my_vps ./devops/prod/.env ./devops/prod/Makefile ./devops/prod/docker-compose.yml root@93.115.21.78:/root/apps/notifier/backend
