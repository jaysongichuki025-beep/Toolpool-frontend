# ═══════════════════════════════════════════════════════════════════════════
# Frontend Dockerfile — multi-stage build
# ═══════════════════════════════════════════════════════════════════════════
# Stage 1: Build the React app into static files (dist/)
# Stage 2: Serve those files with Nginx (tiny, fast production server)
# ═══════════════════════════════════════════════════════════════════════════

# ── STAGE 1: Build ────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# VITE_API_URL is baked into the JS bundle at build time
# Pass it with: docker build --build-arg VITE_API_URL=https://api.example.com/api
ARG VITE_API_URL=http://localhost:8000/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ── STAGE 2: Nginx serve ──────────────────────────────────────────────────
FROM nginx:alpine

# Copy built files from stage 1 into Nginx's web root
COPY --from=build /app/dist /usr/share/nginx/html

# Custom Nginx config for React Router (SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Nginx starts automatically via the base image CMD
