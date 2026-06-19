# Backlog Produit — Plateforme Dossier Patient EPS2
> Durée totale : **24 semaines** · 1 juillet → 15 décembre 2026 · 12 Sprints × 2 semaines  
> Méthode : **Hybride Cycle en V + Scrum** · Priorisation **MoSCoW**

---

## ✅ État actuel du prototype v2

Ce qui est déjà livré et fonctionnel :

- [x] Authentification multi-rôles (Administrateur / Médecin / Accueil)
- [x] Tableau de bord avec KPIs et graphiques (recharts)
- [x] Gestion patients — création, liste, recherche
- [x] Fiche patient détaillée avec historique des consultations
- [x] Module Consultations — saisie, liste, diagnostic
- [x] Module Rendez-vous — planning, statuts (Planifié / Honoré / Annulé)
- [x] Gestion des utilisateurs (CRUD complet, côté admin)
- [x] Landing page professionnelle (responsive, illustration médicale)
- [x] Page connexion redesignée
- [x] Navigation responsive (mobile bottom nav, tablet icon-only)
- [x] Icônes Lucide React dans toute l'interface

---

## 🔴 MUST HAVE — Sprint 0 → 3 (déjà réalisés)

### Sprint 0 · Cadrage et architecture
- [x] Définition de l'architecture technique (React + Node.js + SQLite → PostgreSQL)
- [x] Mise en place du dépôt GitHub
- [x] Initialisation du projet (Vite, Express, routage, auth JWT)
- [x] Design system et charte graphique (couleurs, typographie, composants)

### Sprint 1 · Gestion patients
- [x] Formulaire de création d'un dossier patient
- [x] Liste des patients avec recherche
- [x] Fiche patient (informations personnelles, antécédents)
- [x] Modification des informations patient
- [ ] **Suppression logique** d'un dossier (archivage, pas suppression physique)
- [ ] **Numéro de dossier unique** auto-généré (format IPP : ex. `EPS2-2025-00001`)

### Sprint 2 · Consultations
- [x] Saisie d'une consultation (motif, diagnostic, notes)
- [x] Historique des consultations par patient
- [ ] **Champs médicaux complets** : tension artérielle, température, poids, taille, fréquence cardiaque
- [ ] **Prescription associée** à une consultation (lien vers module Pharmacie)
- [ ] **Impression / export PDF** de la consultation

### Sprint 3 · Rendez-vous
- [x] Prise de rendez-vous (patient, médecin, date, heure)
- [x] Liste des rendez-vous avec filtres par date et statut
- [x] Changement de statut (Planifié → Honoré / Annulé)
- [ ] **Vue calendrier** (agenda hebdomadaire / mensuel du médecin)
- [ ] **Rappels automatiques** côté interface (badge RDV du jour dans la topbar)
- [ ] **Détection de conflits** d'horaire pour un même médecin

---

## 🟠 SHOULD HAVE — Sprints 4, 5, 6

### Sprint 4 · Hospitalisation
- [ ] Formulaire d'admission (date entrée, service, lit, médecin responsable)
- [ ] Liste des patients hospitalisés (vue en temps réel par service/lit)
- [ ] Suivi du séjour : notes quotidiennes, prescriptions de soins infirmiers
- [ ] Sortie du patient (date sortie, diagnostic de sortie, compte-rendu)
- [ ] Gestion des lits : statut libre / occupé / réservé par service
- [ ] Historique des hospitalisations dans la fiche patient

### Sprint 5 · Laboratoire
- [ ] Demande d'analyse biologique depuis une consultation (formulaire prescripteur)
- [ ] Liste des demandes d'analyse (en attente / en cours / résultat disponible)
- [ ] Saisie des résultats d'examens (biologiste)
- [ ] Visualisation des résultats dans la fiche patient
- [ ] Alertes pour résultats hors normes (valeurs critiques)
- [ ] Export PDF des résultats d'analyse

### Sprint 6 · Pharmacie
- [ ] Génération d'ordonnance depuis une consultation
- [ ] Liste des ordonnances par patient
- [ ] Module de dispensation : validation des médicaments délivrés (pharmacien)
- [ ] Suivi du stock de médicaments (entrées / sorties / alertes rupture)
- [ ] Historique des prescriptions dans la fiche patient
- [ ] Alerte interactions médicamenteuses (liste configurable)

---

## 🟡 COULD HAVE — Sprint 7 (optionnel V1)

### Sprint 7 · Facturation (V1 simplifiée)
- [ ] Génération de facture liée à un séjour ou une consultation
- [ ] Prise en charge par assurance maladie (CMU, IPM) : taux et plafonds configurables
- [ ] Statut de paiement : En attente / Partiellement payé / Soldé
- [ ] Impression du reçu / ticket de caisse
- [ ] Rapport financier mensuel exportable

---

## 🟢 COULD HAVE — Sprint 8

### Sprint 8 · Tableaux de bord avancés
- [x] KPIs de base (patients, consultations, RDV du jour, RDV planifiés)
- [x] Graphique consultations par mois (barres)
- [x] Graphique RDV par statut (camembert)
- [x] Répartition par sexe et par tranche d'âge
- [ ] **KPIs hospitalisation** : taux d'occupation des lits, durée moyenne de séjour
- [ ] **KPIs laboratoire** : volume d'analyses par type, délais de rendu
- [ ] **KPIs pharmacie** : médicaments les plus prescrits, alertes de stock
- [ ] **Filtres temporels** sur tous les graphiques (7j / 30j / 3 mois / 1 an)
- [ ] **Export des graphiques** en PNG / PDF

---

## 🔒 Sécurité & Conformité — Sprint 9

### Sprint 9 · Sécurité et optimisation
- [ ] **Hachage des mots de passe** avec `bcrypt` (critique — actuellement en clair)
- [ ] **Expiration du JWT** (8 heures) + token de rafraîchissement
- [ ] **Variables d'environnement** : sortir tous les secrets dans `.env` (JWT_SECRET, DB_URL…)
- [ ] **Rate limiting** sur le endpoint `/api/login` (max 5 tentatives / 15 min)
- [ ] **Validation côté serveur** de tous les formulaires (express-validator ou Zod)
- [ ] **Journaux d'audit** : enregistrer chaque action sensible (connexion, modification dossier, suppression)
- [ ] **Chiffrement des données sensibles** en base (données d'identification patient)
- [ ] **Headers de sécurité HTTP** (Helmet.js)
- [ ] **CORS sécurisé** : restreindre aux origines autorisées
- [ ] Migration **SQLite → PostgreSQL** (architecture cible définie dans le projet)
- [ ] Tests de pénétration basiques (OWASP Top 10)

---

## 🧪 Qualité & Tests — Sprint 10

### Sprint 10 · Recette utilisateur
- [ ] **Tests unitaires** côté frontend (Vitest) — composants critiques (Login, Patients, Consultations)
- [ ] **Tests d'intégration** API (routes `/api/patients`, `/api/consultations`, `/api/rdv`)
- [ ] **Tests End-to-End** (Playwright) — parcours : connexion → créer patient → ajouter consultation → prendre RDV
- [ ] **Intégration SonarQube** pour analyse de qualité du code (prévu dans l'architecture)
- [ ] **Pipeline CI/CD GitHub Actions** : lint + tests + build à chaque push sur `main`
- [ ] Sessions de recette utilisateur avec les soignants (médecins, agents d'accueil)
- [ ] Correction des bugs remontés lors de la recette
- [ ] **Documentation utilisateur** : guide de prise en main (PDF ou page d'aide dans l'app)
- [ ] **Documentation technique API** (Swagger / OpenAPI)

---

## 🚀 Déploiement — Sprint 11

### Sprint 11 · Déploiement pilote
- [ ] Containerisation avec **Docker** (image frontend + image backend + base PostgreSQL)
- [ ] Fichier `docker-compose.yml` pour démarrage en une commande
- [ ] Déploiement sur **Shipiix** (hébergeur retenu dans l'architecture)
- [ ] Configuration **HTTPS** avec certificat TLS (Let's Encrypt via reverse proxy Nginx/Caddy)
- [ ] Mise en place des **sauvegardes automatiques** de la base de données (cron quotidien)
- [ ] **Monitoring et alertes** : uptime, erreurs 5xx, latence API
- [ ] Plan de reprise d'activité (PRA) documenté
- [ ] Formation des administrateurs système de l'EPS2
- [ ] Ouverture progressive aux utilisateurs (déploiement pilote sur un service)

---

## ⏳ WON'T HAVE — Reporté en V2

> Ces fonctionnalités sont exclues du périmètre V1 selon la priorisation MoSCoW du projet.

- [ ] Facturation complète avec intégration assurance nationale
- [ ] Interconnexion avec le système national de santé (MSAS)
- [ ] Télémédecine (consultation à distance)
- [ ] Application mobile native (iOS / Android)
- [ ] Gestion des ressources humaines (planning du personnel soignant)
- [ ] Comptabilité générale
- [ ] Multi-établissements (réseau EPS2 régional)
- [ ] Intelligence artificielle (aide au diagnostic, détection d'anomalies)

---

## 📐 Tâches techniques transversales

> Ces tâches s'appliquent tout au long du projet, sans sprint dédié.

### Architecture & Code
- [ ] Refactorisation : découper `server/index.js` en modules par domaine (`routes/patients.js`, `routes/consultations.js`, etc.)
- [ ] Ajouter une couche `controllers/` pour séparer la logique métier des routes
- [ ] Créer des `hooks/` personnalisés côté React (`usePatients`, `useConsultations`…)
- [ ] Lazy-loading des pages React (`React.lazy`) pour réduire le bundle initial (actuellement 623 kB)
- [ ] Ajouter un système de notifications toast (succès / erreur) unifié

### UX / Interface
- [ ] Skeletons de chargement sur toutes les listes (remplacer "Chargement…")
- [ ] Recherche globale dans la topbar (patient par nom, prénom, IPP)
- [ ] Mode sombre (dark mode) avec bascule persistée dans `localStorage`
- [ ] Raccourcis clavier pour navigation rapide entre modules
- [ ] Fil d'Ariane (breadcrumb) sur les pages profondes (fiche patient, détail consultation)
- [ ] CSS `@media print` pour impression propre des fiches et tableaux

### Accessibilité
- [ ] Attributs ARIA sur tous les composants interactifs (formulaires, modales, tableaux)
- [ ] Contraste des couleurs conforme WCAG AA
- [ ] Navigation au clavier intégrale (focus visible, ordre de tabulation logique)

---

## 📊 KPIs cibles du projet (Annexe projet)

| Indicateur | Cible | État actuel |
|---|---|---|
| Taux de digitalisation des dossiers patients | **95 %** | — |
| Temps de recherche d'un dossier patient | **< 30 secondes** | ~ OK (liste + recherche) |
| Disponibilité de la plateforme | **99,9 %** | Non mesuré |
| Taux de satisfaction des utilisateurs | **> 85 %** | Non mesuré |

---

## 📅 Planning des sprints restants

| Sprint | Objectif | Dates cibles | Statut |
|--------|----------|-------------|--------|
| Sprint 0 | Cadrage et architecture | Sem. 1–2 | ✅ Fait |
| Sprint 1 | Gestion patients | Sem. 3–4 | ✅ Fait |
| Sprint 2 | Consultations | Sem. 5–6 | ✅ Fait |
| Sprint 3 | Rendez-vous | Sem. 7–8 | ✅ Fait |
| **Sprint 4** | **Hospitalisation** | **Sem. 9–10** | 🔲 À faire |
| **Sprint 5** | **Laboratoire** | **Sem. 11–12** | 🔲 À faire |
| **Sprint 6** | **Pharmacie** | **Sem. 13–14** | 🔲 À faire |
| Sprint 7 | Facturation | Sem. 15–16 | 🔲 Optionnel |
| Sprint 8 | Tableaux de bord avancés | Sem. 17–18 | 🔲 À faire |
| **Sprint 9** | **Sécurité & optimisation** | **Sem. 19–20** | 🔲 Critique |
| **Sprint 10** | **Recette utilisateur** | **Sem. 21–22** | 🔲 À faire |
| **Sprint 11** | **Déploiement pilote** | **Sem. 23–24** | 🔲 À faire |

---

## ⚠️ Risques à surveiller (plan d'atténuation)

| Risque | Probabilité | Impact | Action |
|--------|-------------|--------|--------|
| Résistance au changement des soignants | Moyenne | Moyen | Recette utilisateur tôt (Sprint 10), formation, guide d'utilisation |
| Cyberattaque / fuite de données | Moyenne | **Critique** | Sprint 9 dédié sécurité, bcrypt, HTTPS, audit |
| Retard de développement | **Élevée** | Moyen | MoSCoW strict, ne pas démarrer Sprint 4 sans Sprint 1–3 stables |
| Perte de données | Faible | **Critique** | Sauvegardes automatiques dès Sprint 11, PostgreSQL |

---

*Backlog généré le 18 juin 2025 · Basé sur le plan de projet EPS2 — 24 semaines, 12 sprints*  
*Mise à jour à chaque Sprint Review.*
