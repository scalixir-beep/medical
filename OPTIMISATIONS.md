# Feuille de route — Optimisations plateforme EPS2

> Prototype v2 fonctionnel. Ce document liste les améliorations prioritaires pour passer à une version production.

---

## 🔴 Priorité 1 — Sécurité & Production

| # | Amélioration | Détail |
|---|---|---|
| 1.1 | **Hachage des mots de passe** | Remplacer les mots de passe en clair par `bcrypt`. Critique avant tout déploiement. |
| 1.2 | **Token JWT sécurisé** | Ajouter expiration du token (ex. 8h), refresh token, et révocation côté serveur. |
| 1.3 | **Variables d'environnement** | Sortir les secrets (JWT_SECRET, etc.) dans un fichier `.env` non commité. |
| 1.4 | **HTTPS** | Forcer HTTPS en production via un reverse proxy (Nginx / Caddy). |
| 1.5 | **Rate limiting** | Limiter les tentatives de connexion (ex. 5 essais / 15 min) pour prévenir le brute-force. |
| 1.6 | **Base de données robuste** | Migrer de SQLite vers PostgreSQL ou MySQL pour la production multi-utilisateurs. |

---

## 🟠 Priorité 2 — Fonctionnalités métier

| # | Amélioration | Détail |
|---|---|---|
| 2.1 | **Recherche globale** | Barre de recherche dans la topbar pour trouver un patient par nom, prénom ou code. |
| 2.2 | **Export PDF du dossier patient** | Générer un PDF du dossier médical complet (consultations + RDV) via `jsPDF` ou côté serveur. |
| 2.3 | **Impressions d'ordonnances** | Modèle d'ordonnance imprimable depuis la fiche consultation. |
| 2.4 | **Notifications en temps réel** | Alertes pour RDV du jour (badge dans la topbar), via polling ou WebSocket. |
| 2.5 | **Gestion des absences** | Marquer un médecin absent et réaffecter automatiquement ses RDV. |
| 2.6 | **Historique de connexion** | Journal des connexions par utilisateur (IP, date, navigateur) pour l'audit. |
| 2.7 | **Champs médicaux enrichis** | Ajouter tension artérielle, poids, taille, groupe sanguin, allergies dans le dossier. |
| 2.8 | **Module Pharmacie (v3)** | Suivi du stock de médicaments, ordonnances liées, alertes rupture. |
| 2.9 | **Module Laboratoire (v3)** | Saisie et visualisation des résultats d'analyses biologiques. |
| 2.10 | **Module Facturation (v3)** | Génération de factures, suivi des paiements, intégration CMU. |

---

## 🟡 Priorité 3 — UX & Interface

| # | Amélioration | Détail |
|---|---|---|
| 3.1 | **Thème sombre (Dark Mode)** | Toggle clair/sombre avec persistance dans `localStorage`. |
| 3.2 | **Skeletons de chargement** | Remplacer "Chargement…" par des squelettes animés pour un rendu plus pro. |
| 3.3 | **Menu mobile hamburger** | Drawer latéral sur mobile pour remplacer la nav bottom sur petits écrans. |
| 3.4 | **Pagination et filtres avancés** | Pagination côté serveur pour les listes de patients/consultations (> 100 entrées). |
| 3.5 | **Multi-langue** | Support Français / Wolof via `i18next`. |
| 3.6 | **Raccourcis clavier** | Navigation rapide entre les pages avec des raccourcis (ex. `G+P` → Patients). |
| 3.7 | **Fil d'Ariane (breadcrumb)** | Indiquer la position dans l'application sur les pages profondes. |
| 3.8 | **Mode impression** | CSS `@media print` pour imprimer proprement les tableaux et fiches. |

---

## 🟢 Priorité 4 — Performance & Qualité

| # | Amélioration | Détail |
|---|---|---|
| 4.1 | **Tests automatisés** | Ajouter tests unitaires (Vitest) et E2E (Playwright) pour les flux critiques. |
| 4.2 | **CI/CD** | Pipeline GitHub Actions : lint + tests + build à chaque push sur `main`. |
| 4.3 | **Code splitting** | Lazy-loading des pages React (`React.lazy`) pour réduire le bundle initial. |
| 4.4 | **PWA (hors-ligne)** | Service Worker pour un accès limité sans connexion réseau. |
| 4.5 | **Export des graphiques** | Bouton "Télécharger en PNG" sur chaque graphique recharts. |
| 4.6 | **Logs serveur structurés** | Remplacer `console.log` par un logger (ex. `pino`) avec niveaux et rotation. |
| 4.7 | **Documentation API** | Générer automatiquement la doc des endpoints REST (ex. avec Swagger/OpenAPI). |
| 4.8 | **Monitoring** | Tableau de bord de santé serveur (uptime, erreurs 5xx, latence API). |

---

## 📐 Architecture cible (v3)

```
eps2-dossier-patient/
├── server/
│   ├── routes/          # Un fichier par domaine (patients, consultations, rdv…)
│   ├── controllers/     # Logique métier séparée des routes
│   ├── middleware/      # Auth, rate-limit, validation
│   ├── models/          # Schémas de base de données
│   └── index.js
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   │   ├── ui/      # Composants génériques réutilisables
│   │   │   └── layout/
│   │   ├── hooks/       # Hooks personnalisés (usePatients, useRdv…)
│   │   ├── stores/      # État global (Zustand ou Context)
│   │   └── api/         # Clients API par domaine
│   └── tests/
└── docs/                # Documentation et maquettes
```

---

## 🗓️ Planning suggéré

| Sprint | Durée | Contenu |
|--------|-------|---------|
| Sprint 1 | 2 semaines | Sécurité (1.1 → 1.5) + base de données PostgreSQL |
| Sprint 2 | 2 semaines | Recherche globale + Export PDF + Notifications |
| Sprint 3 | 2 semaines | Champs médicaux enrichis + Historique connexions |
| Sprint 4 | 2 semaines | Tests + CI/CD + Dark mode + Skeletons |
| Sprint 5 | 3 semaines | Module Pharmacie (v3) |
| Sprint 6 | 3 semaines | Module Facturation (v3) |

---

*Document généré le 17 juin 2025 — Prototype EPS2 v2.0*
