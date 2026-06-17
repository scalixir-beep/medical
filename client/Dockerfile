# ──────────────────────────────────────────────────────────────────
#  EPS2 – Frontend  ·  React (Vite) → nginx
#
#  Stage 1 : build  — Node.js + Vite  (~400 MB, écarté après build)
#  Stage 2 : serve  — nginx:alpine    (~45 MB image finale)
# ──────────────────────────────────────────────────────────────────

# ── Stage 1 : Construction du bundle ─────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /build

# Dépendances en premier pour maximiser le cache Docker
COPY package.json package-lock.json ./
RUN npm ci

# Code source complet, puis build Vite
COPY . .
RUN npm run build

# ── Stage 2 : Serveur nginx ──────────────────────────────────────
FROM nginx:1.27-alpine

# Copie uniquement le bundle compilé (quelques Mo)
COPY --from=builder /build/dist /usr/share/nginx/html

# Config nginx : SPA routing + proxy /api → backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ > /dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
