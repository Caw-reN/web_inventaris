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

# Ensure .env file exists inside container
if [ ! -f /var/www/html/.env ]; then
    if [ -f /var/www/html/.env.example ]; then
        cp /var/www/html/.env.example /var/www/html/.env
    else
        touch /var/www/html/.env
    fi
fi

# Generate key if not present in .env
if ! grep -q "^APP_KEY=base64" /var/www/html/.env 2>/dev/null; then
    echo "Generating APP_KEY..."
    php artisan key:generate --force || true
fi

# Create storage symlink
php artisan storage:link --force || true

# Refresh optimization caches
echo "Optimizing Laravel caches..."
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# Start Supervisord
echo "Starting Supervisor..."
exec supervisord -c /etc/supervisor/conf.d/supervisord.conf
