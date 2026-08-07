#!/bin/bash

echo "Starting container entrypoint..."

# Ensure required storage directories exist
mkdir -p /var/www/html/storage/logs \
         /var/www/html/storage/framework/views \
         /var/www/html/storage/framework/sessions \
         /var/www/html/storage/framework/cache \
         /var/www/html/bootstrap/cache

# Fix ownership and permissions
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache || true
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache || true

# Wipe any stale bootstrap cache files
rm -f /var/www/html/bootstrap/cache/*.php

# Ensure .env file exists
if [ ! -f /var/www/html/.env ]; then
    if [ -f /var/www/html/.env.example ]; then
        cp /var/www/html/.env.example /var/www/html/.env
    else
        touch /var/www/html/.env
    fi
fi

# Generate APP_KEY if not present in .env
if ! grep -q "^APP_KEY=base64" /var/www/html/.env 2>/dev/null; then
    echo "Generating APP_KEY..."
    php artisan key:generate --force || true
fi

# Export valid APP_KEY directly into environment
if grep -q "^APP_KEY=base64" /var/www/html/.env 2>/dev/null; then
    export APP_KEY="$(grep "^APP_KEY=base64" /var/www/html/.env | head -n 1 | cut -d '=' -f 2- | tr -d '\r')"
fi

# Create storage symlink
php artisan storage:link --force || true

# Refresh optimization caches with valid environment key
echo "Optimizing Laravel caches..."
php artisan route:clear || true
php artisan view:clear || true
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# Start Supervisord
echo "Starting Supervisor..."
exec supervisord -c /etc/supervisor/conf.d/supervisord.conf
