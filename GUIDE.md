# Guide de la plateforme EPS2 — version 2

Cette version ajoute trois apports majeurs à la plateforme de gestion du dossier
patient : la **gestion des rôles**, des **indicateurs (KPI) graphiques** et une
**identité visuelle sénégalaise**.

---

## 1. Rôles et permissions

Trois rôles sont définis. Les autorisations sont appliquées **deux fois** : côté
serveur (sécurité réelle) et côté interface (menus et boutons adaptés).

| Action | Administrateur | Médecin | Utilisateur (Accueil) |
|---|:--:|:--:|:--:|
| Tableau de bord / KPI | ✅ | ✅ | ✅ |
| Voir les patients | ✅ | ✅ | ✅ |
| Créer / enregistrer un patient | ✅ | ✅ | ✅ |
| Supprimer un patient | ✅ | ❌ | ❌ |
| Voir les consultations | ✅ | ✅ | ❌ |
| Créer une consultation (acte clinique) | ✅ | ✅ | ❌ |
| Gérer les rendez-vous | ✅ | ✅ | ✅ |
| Gérer les utilisateurs et les rôles | ✅ | ❌ | ❌ |

### Comptes de démonstration

| Rôle | Identifiant | Mot de passe |
|---|---|---|
| Administrateur | `admin` | `admin` |
| Médecin | `medecin` | `medecin` |
| Utilisateur (accueil) | `user` | `user` |

### Comment le filtrage fonctionne

- **Serveur** (`server/index.js`) : un middleware `requireRole(...)` protège chaque
  route sensible. Exemple : créer une consultation est réservé à
  `Administrateur` et `Médecin`. Une tentative non autorisée renvoie une
  erreur **403 Accès refusé**.
- **Interface** (`client/src/perms.js`) : une matrice `PERMS` reproduit ces règles.
  Le menu, les boutons (« Supprimer », « + Ajouter ») et l'accès aux pages
  s'adaptent automatiquement au rôle connecté.

---

## 2. Indicateurs (KPI) et graphiques

Le tableau de bord présente quatre compteurs clés et quatre graphiques
(bibliothèque **recharts**), alimentés par l'endpoint `GET /api/kpis` :

- **Consultations par mois** — histogramme sur les 6 derniers mois.
- **Rendez-vous par statut** — anneau (Planifié / Honoré / Annulé).
- **Répartition par sexe** — camembert des patients.
- **Patients par tranche d'âge** — histogramme démographique (0-17, 18-39, 40-59, 60+).

Les données sont calculées en temps réel à partir de la base SQLite ; ajouter un
patient ou une consultation met les graphiques à jour.

---

## 3. Identité visuelle sénégalaise

- **Couleurs** : vert du Sénégal (#117A3D) en couleur principale, accent **or**
  (#F4B400), et le drapeau (vert / jaune / rouge) rappelé sur l'écran de connexion.
- **Logo** : croix médicale blanche + étoile à cinq branches dorée (santé + Sénégal).
- **Illustrations** : soleil et silhouette de **baobab**, dessinés en SVG
  (`client/src/components/Brand.jsx`). Ils sont **originaux** : aucun problème de
  droits d'auteur.

> Pour utiliser de vraies photos (hôpital, soignants sénégalais), remplacez le
> composant `Baobab` de l'écran de connexion par une balise `<img>` pointant vers
> votre image — en veillant à utiliser des photos **libres de droits** ou les vôtres.

---

## 4. Lancer la plateforme

```bash
npm install      # installe le projet, le serveur et le client
npm run dev      # démarre l'API (port 4000) et l'interface (port 5173)
```

Puis ouvrir **http://localhost:5173** et se connecter avec un compte de démo.

Pour repartir d'une base vierge : supprimer `server/data.db` puis relancer.

---

## 5. Pour aller plus loin

### Ajouter un rôle
1. Dans `server/index.js`, ajouter le rôle dans l'objet `ROLE` et l'utiliser dans
   les `requireRole(...)` concernés.
2. Dans `client/src/perms.js`, ajouter une ligne à `PERMS` avec ses autorisations.

### Ajouter un module (ex. Pharmacie, Laboratoire, Facturation)
1. Créer la table dans le bloc `CREATE TABLE` de `server/index.js`.
2. Ajouter les routes (sur le modèle de `/api/patients`) en les protégeant par
   `requireRole(...)`.
3. Créer la page dans `client/src/pages/`, l'ajouter au routeur
   (`client/src/main.jsx`) et au menu (`client/src/components/Layout.jsx`),
   en conditionnant l'affichage avec `can(user, "...")`.

### Renforcer la sécurité (vers la production)
Ce prototype utilise des mots de passe en clair et un jeton simple en mémoire.
Pour une mise en production : hachage des mots de passe (bcrypt), jetons JWT,
HTTPS, et hébergement conforme aux règles sur les données de santé.
