# ──────────────────────────────────────────────────────────────────────
#  EPS2 – API Dossier Patient  ·  Express + sql.js (SQLite/WASM)
#
#  Build :  docker build -t eps2-api ./server
#  Run   :  docker run -p 4000:4000 -v eps2-db:/app/data.db eps2-api
# ──────────────────────────────────────────────────────────────────────
FROM node:20-alpine

# ── Sécurité : utilisateur non-root dédié ─────────────────────────────
RUN addgroup -S eps2 && adduser -S eps2 -G eps2

WORKDIR /app

# ── Dépendances (couche mise en cache tant que package*.json ne change pas)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# ── Code source + fichier SQL de référence ─────────────────────────────
COPY index.js db.js medical.sql ./

# Transfert de propriété à l'utilisateur applicatif
RUN chown -R eps2:eps2 /app

USER eps2

# ── Runtime ────────────────────────────────────────────────────────────
ENV NODE_ENV=production \
    PORT=4000

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD nc -z localhost 4000 || exit 1

CMD ["node", "index.js"]
