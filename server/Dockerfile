# ──────────────────────────────────────────────────────────────────
#  EPS2 – API Dossier Patient  ·  Express + sql.js (SQLite/WASM)
#
#  Build :  docker build -t eps2-api ./server
#  Run   :  docker run -p 4000:4000 -v eps2-db:/app/data.db eps2-api
# ──────────────────────────────────────────────────────────────────
FROM node:20-alpine

# ── Sécurité : utilisateur non-root dédié ─────────────────────
RUN addgroup -S eps2 && adduser -S eps2 -G eps2

WORKDIR /app

# ── Dépendances ────────────────────────────────────────────────
# Copiés en premier : Docker met cette couche en cache tant que
# package*.json ne change pas → rebuild rapide si seul le code change
COPY package.json package-lock.json ./

# npm ci : installation stricte depuis le lock-file (reproductible)
# --omit=dev : pas de devDependencies en production
RUN npm ci --omit=dev && npm cache clean --force

# ── Code source + seed SQL ────────────────────────────────────
COPY index.js db.js medical.sql ./

# L'utilisateur applicatif prend possession du dossier
RUN chown -R eps2:eps2 /app

USER eps2

# ── Runtime ───────────────────────────────────────────────────
ENV NODE_ENV=production \
    PORT=4000

EXPOSE 4000

# Vérification de santé toutes les 30 s
# nc (netcat) est inclus dans Alpine : sonde TCP légère
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD nc -z localhost 4000 || exit 1

# Forme exec (pas de shell wrapper) : Node reçoit SIGTERM directement
CMD ["node", "index.js"]
