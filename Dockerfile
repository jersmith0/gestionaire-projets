# Étape 1 : Build Angular
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build -- --configuration production

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/gestionaire-projets/browser/. /usr/share/nginx/html

EXPOSE 80
