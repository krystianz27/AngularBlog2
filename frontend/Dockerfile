# FROM node:20 AS build

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npm run build -- --configuration production

# FROM nginx:alpine

# COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# EXPOSE 80

# CMD [ "nginx", "-g", "daemon off;" ]


FROM node:20 AS development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4200

CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
