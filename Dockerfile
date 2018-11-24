FROM node:latest

EXPOSE 8080

WORKDIR /app

RUN apt-get update -qq

RUN apt-get install vim -y

RUN yarn install
WORKDIR /app/artifinder
CMD yarn serve
