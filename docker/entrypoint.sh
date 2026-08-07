#!/bin/bash
set -e

# Cache configuration, routes, and views in production
echo "Running optimization commands..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create storage symlink if not exists
php artisan storage:link --force || true

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force

# Ensure proper permissions
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Start Supervisord
echo "Starting Supervisor..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
