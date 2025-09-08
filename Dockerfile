# syntax=docker/dockerfile:1

# ===== Build stage =====
FROM node:18-alpine AS build
WORKDIR /app

# Install OS deps
RUN apk add --no-cache git

# Copy package files and install deps
COPY package.json package-lock.json* yarn.lock* ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

# Copy source
COPY . .

# Build
ENV CI=true
RUN npm run build

# ===== Runtime stage =====
FROM nginx:1.27-alpine AS runtime

# Default NGINX config for SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=build /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
