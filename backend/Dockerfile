# ─────────────────────────────────────────────────────────────
#  EPS2 – API Laravel  ·  PHP 8.2 + Nginx + SQLite
#  Build  : docker build -t eps2-laravel ./backend
#  Run    : docker run -p 8000:80 -v eps2-db:/var/www/html/database eps2-laravel
# ─────────────────────────────────────────────────────────────
FROM php:8.2-fpm-alpine

# ── Dépendances système ────────────────────────────────────────
RUN apk add --no-cache \
        nginx \
        supervisor \
        sqlite \
    && docker-php-ext-install pdo pdo_sqlite bcmath \
    && docker-php-ext-enable pdo_sqlite

# ── Composer ───────────────────────────────────────────────────
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ── Code source ────────────────────────────────────────────────
WORKDIR /var/www/html
COPY . .

# ── Dépendances PHP (prod uniquement) ─────────────────────────
RUN composer install --no-dev --optimize-autoloader --no-interaction \
    && php artisan config:clear \
    && php artisan route:clear

# ── Permissions ───────────────────────────────────────────────
RUN chown -R www-data:www-data storage bootstrap/cache database \
    && chmod -R 775 storage bootstrap/cache database

# ── Configs Nginx + Supervisor ────────────────────────────────
COPY docker/nginx.conf      /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisord.conf

# ── Entrypoint ────────────────────────────────────────────────
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
