FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration=production

FROM nginx:1.25-alpine

COPY --from=build /app/dist/pax-canina /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ || exit 1

EXPOSE 80
