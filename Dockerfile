# Stage 1: Build the React App using Vite
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and lock files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the build with NGINX
FROM nginx:alpine

# Copy build output to NGINX's HTML directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove default NGINX config and replace with a clean one
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
