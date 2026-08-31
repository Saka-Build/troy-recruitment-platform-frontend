# ============================================================
# Stage 1: Build React/Vite frontend
# ============================================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency files first for Docker layer caching
COPY package.json package-lock.json ./

RUN npm ci --no-audit --no-fund

COPY . .

# Vite is configured with base "/ats/", so the build emits /ats/-prefixed URLs
RUN npm run build


# ============================================================
# Stage 2: Nginx production runtime
# ============================================================
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Served under /ats/, so the build lands in an /ats subdirectory and plain
# `root` resolves it - no alias/try_files interaction to get wrong.
COPY --from=build /app/dist /usr/share/nginx/html/ats

# The entrypoint runs envsubst over templates into /etc/nginx/conf.d
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Backend the /api proxy forwards to; override at run time
ENV API_UPSTREAM="http://13.233.44.12:8080"

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
