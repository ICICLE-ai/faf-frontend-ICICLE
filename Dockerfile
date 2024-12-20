# Stage 1: Build Angular project
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json /app/
RUN npm install

# Copy all project files
#COPY . .

COPY ./ /app

#COPY src ./src
#COPY angular.json tsconfig.json tsconfig.app.json ./

# Build the Angular project for production
#RUN npm run build -- --configuration production

RUN npm run build --prod

# Stage 2: Serve with Nginx
FROM nginx:alpine
#COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy built Angular files to Nginx default directory
COPY --from=build /app/dist/faf-frontend /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]