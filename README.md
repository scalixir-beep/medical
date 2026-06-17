# Plateforme de gestion du dossier patient — EPS2 (prototype v2)

Prototype fonctionnel d'une plateforme de gestion du dossier patient pour un
Établissement Public de Santé de Niveau 2.

- **Frontend** : React (Vite) + React Router
- **Backend** : Node.js + Express
- **Base de données** : SQLite (via `sql.js`, fichier `server/data.db`)

Modules : **Authentification multi-rôles**, **Tableau de bord avec KPI graphiques**,
**Gestion Patient**, **Consultations**, **Rendez-vous** et **Gestion des utilisateurs**.

> **Nouveautés v2** : 3 rôles (Administrateur / Médecin / Utilisateur) avec filtrage des accès,
> graphiques KPI (recharts) et identité visuelle sénégalaise. Détails dans **GUIDE.md**.

---

## Prérequis

- [Node.js](https://nodejs.org/) version 18 ou supérieure (vérifier avec `node -v`)

## Installation et lancement (recommandé)

Dans le dossier du projet, ouvrez un terminal puis :

```bash
npm install      # installe le projet + le serveur + le client
npm run dev      # démarre le serveur (port 4000) ET le client (port 5173)
```

Ouvrez ensuite votre navigateur sur **http://localhost:5173**

### Comptes de démonstration

| Identifiant | Mot de passe | Rôle           |
|-------------|--------------|----------------|
| `admin`     | `admin`      | Administrateur |
| `medecin`   | `medecin`    | Médecin        |
| `user`      | `user`       | Utilisateur (accueil) |

---

## Lancement manuel (deux terminaux)

Si la commande unique ne fonctionne pas sur votre machine :

**Terminal 1 — le serveur (API)**
```bash
cd server
npm install
npm start
```

**Terminal 2 — le client (interface)**
```bash
cd client
npm install
npm run dev
```

---

## Structure du projet

```
eps2-dossier-patient/
├── server/              API Express + base SQLite
│   ├── index.js         Routes (login, patients, consultations, rendez-vous)
│   ├── db.js            Couche d'accès SQLite (sql.js)
│   └── data.db          Base de données (créée au 1er lancement)
└── client/              Application React
    └── src/
        ├── pages/       Login, Dashboard, Patients, PatientDetail, Consultations, RendezVous
        ├── components/  Layout (barre latérale + barre supérieure)
        ├── api.js       Appels à l'API
        └── auth.jsx     Gestion de la connexion
```

## Bon à savoir

- La base `server/data.db` est créée automatiquement et remplie de quelques
  données d'exemple au premier démarrage. **Pour repartir de zéro**, supprimez
  ce fichier puis relancez le serveur.
- Les données saisies (patients, consultations, rendez-vous) sont **réellement
  enregistrées** dans la base SQLite et persistent après redémarrage.

## Pour aller plus loin

Le code est volontairement simple et extensible. Pour ajouter un module
(ex. Pharmacie, Laboratoire, Facturation) :

1. Créer la table dans `server/index.js` (bloc `CREATE TABLE`).
2. Ajouter les routes correspondantes (sur le modèle de `/api/patients`).
3. Créer une page dans `client/src/pages/` et l'ajouter au routeur
   (`client/src/main.jsx`) et au menu (`client/src/components/Layout.jsx`).
