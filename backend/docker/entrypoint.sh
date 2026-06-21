#!/bin/sh
set -e

# Créer le fichier SQLite s'il n'existe pas (premier démarrage)
if [ ! -f /var/www/html/database/database.sqlite ]; then
    touch /var/www/html/database/database.sqlite
    chown www-data:www-data /var/www/html/database/database.sqlite
fi

# Migrations au démarrage (idempotent)
php artisan migrate --force

# Optimisations production
php artisan config:cache
php artisan route:cache
php artisan event:cache

# Démarrer Supervisor (Debian : /etc/supervisor/supervisord.conf)
exec /usr/bin/supervisord -c /etc/supervisor/supervisord.conf
