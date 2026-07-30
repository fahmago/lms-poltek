# ============================================
# Stage 1: Build Frontend Assets
# ============================================
FROM node:20-alpine AS frontend

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY resources/css ./resources/css
COPY resources/js ./resources/js
COPY vite.config.js tailwind.config.js postcss.config.js ./
RUN npm run build

# ============================================
# Stage 2: Production Image
# ============================================
FROM serversideup/php:8.3-fpm-nginx

# Set working directory
WORKDIR /var/www/html

# Install PHP extensions (gd dibutuhkan untuk phpoffice/phpspreadsheet - import Excel)
USER root
RUN install-php-extensions gd zip

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install dependencies (no dev, no interaction)
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-scripts \
    --prefer-dist \
    --optimize-autoloader

# Copy application files
COPY . .

# Copy built frontend assets from stage 1
COPY --from=frontend /app/public/build ./public/build

# Generate optimized caches
RUN composer dump-autoload --optimize \
    && php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Set correct permissions for all application files
RUN chown -R www-data:www-data /var/www/html

# Ensure PHP-FPM and Nginx runtime directories have correct permissions
RUN mkdir -p /run/php && chown -R www-data:www-data /run/php

# Switch to non-root user for runtime (image expects www-data)
USER www-data

# Expose port 80
EXPOSE 80
