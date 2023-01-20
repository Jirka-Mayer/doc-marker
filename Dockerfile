# syntax=docker/dockerfile:1
FROM node:16.14.0-alpine AS build-env
WORKDIR /app

# copy dependencies and install
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install

# copy source code and build
COPY ./src ./src
COPY ./forms ./forms
RUN npm run build

# build runtime image
FROM nginx:stable
COPY --from=build-env /app/dist /usr/share/nginx/html
