# ─────────────────────────────────────────────────────────────
#  EPS2 – API Laravel  ·  PHP 8.3 + Nginx + SQLite  (Debian)
# ─────────────────────────────────────────────────────────────
FROM php:8.3-fpm

# ── Dépendances système ───────────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
        nginx \
        supervisor \
        sqlite3 \
        libsqlite3-dev \
        curl \
        unzip \
    && docker-php-ext-install pdo pdo_sqlite bcmath \
    && docker-php-ext-enable pdo_sqlite \
    && rm -rf /var/lib/apt/lists/*

# ── Composer ─────────────────────────────────────────────────
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ── Code source ──────────────────────────────────────────────
WORKDIR /var/www/html
COPY . .

# ── Dépendances PHP (prod) ────────────────────────────────────
RUN composer install --no-dev --optimize-autoloader --no-interaction --ignore-platform-reqs \
    && php artisan config:clear \
    && php artisan route:clear

# ── Permissions ───────────────────────────────────────────────
RUN chown -R www-data:www-data storage bootstrap/cache database \
    && chmod -R 775 storage bootstrap/cache database

# ── Nginx (Debian : sites-available) ─────────────────────────
COPY docker/nginx.conf /etc/nginx/sites-available/default

# ── Supervisor (Debian : /etc/supervisor/supervisord.conf) ────
COPY docker/supervisord.conf /etc/supervisor/supervisord.conf

# ── Entrypoint ────────────────────────────────────────────────
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
