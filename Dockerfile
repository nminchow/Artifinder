FROM node:latest

EXPOSE 8080

WORKDIR /app

RUN apt-get update -qq

RUN apt-get install vim -y

WORKDIR /app/artifinder
COPY artifinder/package.json .
RUN yarn install
CMD yarn serve
