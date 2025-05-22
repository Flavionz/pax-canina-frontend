# Étape 1, basée sur Node.js pour construire et compiler l'application Angular
FROM node:18.10-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
# Étape 2, basée sur Nginx pour avoir uniquement le contenu compilé pour servir avec Nginx
FROM nginx:1.17.1-alpine
COPY --from=build /app/dist/pax-canina/browser/ /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
