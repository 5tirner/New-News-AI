FRONT_DIR = ./srcs/frontend

all : 
	docker-compose up --build

clean: 
	docker system prune -af
	docker buildx prune -af
	docker volume prune -af
	rm -rf ${FRONT_DIR}/dist
	npm cache clean --force
	docker system df

re : clean all