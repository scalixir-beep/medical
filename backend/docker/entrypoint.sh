#!/bin/sh
set -e

# Créer le fichier SQLite s'il n'existe pas
if [ ! -f /var/www/html/database/database.sqlite ]; then
    touch /var/www/html/database/database.sqlite
    chown www-data:www-data /var/www/html/database/database.sqlite
fi

# Migrations + seed uniquement si la table users est vide (premier démarrage)
php artisan migrate --force

USER_COUNT=$(php artisan tinker --execute="echo \App\Models\User::count();" 2>/dev/null | tail -1)
if [ "$USER_COUNT" = "0" ] || [ -z "$USER_COUNT" ]; then
    php artisan db:seed --force
fi

# Optimisations production
php artisan config:cache
php artisan route:cache
php artisan event:cache

exec /usr/bin/supervisord -c /etc/supervisor/supervisord.conf
