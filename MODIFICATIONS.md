# EPS2 – CHRASNT Thiès · Modifications à apporter
> Basé sur le rapport de conception (Groupe 5, Swiss UMEF, Juin 2026)  
> et l'état actuel du projet (Laravel + React)

---

## 1. RÔLES — Harmonisation complète

Le projet définit **6 rôles métier** :
`Administrateur · Médecin · Infirmier · Accueil · Pharmacien · Biologiste`

L'ancien rôle `Utilisateur` est obsolète — le remplacer partout.

### Backend

| Fichier | Ligne | Modification |
|---|---|---|
| `database/seeders/DatabaseSeeder.php` | L.14-18 | Remplacer les 3 users par 6 (un par rôle) |
| `app/Http/Controllers/UserController.php` | L.86 | `$rolesValides` → inclure les 6 rôles, retirer `Utilisateur` |
| `app/Http/Controllers/AuthController.php` | register | `in:Médecin,Infirmier,Accueil,Pharmacien,Biologiste` ✓ déjà OK |

**Nouveau seeder utilisateurs :**
```php
['username'=>'admin',      'password'=>Hash::make('admin'),      'name'=>'Administrateur Système', 'role'=>'Administrateur'],
['username'=>'medecin',    'password'=>Hash::make('medecin'),    'name'=>'Dr. Amina Diallo',       'role'=>'Médecin'],
['username'=>'infirmier',  'password'=>Hash::make('infirmier'),  'name'=>'Moussa Diagne',          'role'=>'Infirmier'],
['username'=>'accueil',    'password'=>Hash::make('accueil'),    'name'=>'Awa Ndoye',              'role'=>'Accueil'],
['username'=>'pharmacien', 'password'=>Hash::make('pharmacien'), 'name'=>'Ibou Sarr',              'role'=>'Pharmacien'],
['username'=>'biologiste', 'password'=>Hash::make('biologiste'), 'name'=>'Dr. Fatou Cissé',        'role'=>'Biologiste'],
```

**Nouveau `$rolesValides` dans UserController :**
```php
$rolesValides = ['Administrateur','Médecin','Infirmier','Accueil','Pharmacien','Biologiste'];
```

### Frontend
| Fichier | État |
|---|---|
| `src/perms.js` | ✅ Déjà les 6 rôles avec matrice complète |
| `src/pages/Login.jsx` (hint) | ✅ Déjà les 6 comptes de démo affichés |
| `src/pages/Login.jsx` (ROLES select) | ✅ Déjà `['Médecin','Infirmier','Accueil','Pharmacien','Biologiste']` |

---

## 2. MODULES FONCTIONNELS — État et manques

Selon le document, 6 modules **Must/Should Have** pour la V1 :

| Module | État backend | État frontend | Action |
|---|---|---|---|
| **Authentification** (login + Google + register) | ✅ OK | ✅ OK | — |
| **Gestion Patient** (dossier, historique) | ✅ OK | ✅ OK | — |
| **Consultation** | ✅ OK | ✅ OK | — |
| **Rendez-vous** | ✅ OK | ✅ OK | — |
| **Hospitalisation** | ✅ OK | ✅ OK | — |
| **Pharmacie** (ordonnances + stock) | ✅ OK | ✅ OK | — |
| **Laboratoire** (analyses) | ✅ OK | ✅ OK | — |
| **Tableau de bord (KPIs)** | ✅ OK | ✅ OK | — |
| **Historique connexions** | ✅ OK | ✅ OK | — |
| **Facturation** | ❌ Non implémenté | ❌ Non implémenté | **V2 — reporter** |

---

## 3. BASE DE DONNÉES — Re-seed après corrections rôles

Après modification du seeder, relancer :
```bash
php artisan migrate:fresh --seed
```

> ⚠️ Ceci efface toutes les données existantes.  
> En prod : utiliser `php artisan db:seed` uniquement si la DB est vide.

---

## 4. BACKEND — Corrections techniques identifiées

### 4.1 `config/session.php`
```php
// Changer le fallback de database → file
'driver' => env('SESSION_DRIVER', 'file'),   // ✅ déjà fait
```

### 4.2 `config/cache.php`
```php
// Changer le fallback de database → file
'default' => env('CACHE_STORE', 'file'),     // ✅ déjà fait
```

### 4.3 `.env` — Variables obligatoires
```env
APP_KEY=base64:...                         # généré par artisan key:generate
DB_CONNECTION=sqlite
SESSION_DRIVER=file
CACHE_STORE=file
CORS_ALLOWED_ORIGINS=*                     # ou URL frontend en prod
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

### 4.4 Google OAuth
- Vérifier dans Google Cloud Console que `http://localhost:8000/auth/google/callback`  
  est bien dans les **Authorized redirect URIs**.
- En production remplacer par l'URL du serveur.

---

## 5. FRONTEND — Corrections techniques identifiées

### 5.1 `vite.config.js`
```js
proxy: { "/api": "http://localhost:8000" }   // ✅ déjà corrigé (était 4000)
```

### 5.2 `src/main.jsx` — React Router
```jsx
<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
// ✅ déjà corrigé
```

### 5.3 `src/pages/Login.jsx` — Inscription
- Onglets Connexion / Inscription ✅ déjà ajoutés
- Sélecteur de rôle (5 rôles hors Admin) ✅ déjà ajouté

---

## 6. DÉPLOIEMENT

### Stack retenue
| Couche | Technologie | Changement vs document |
|---|---|---|
| Frontend | React + Vite | ✅ conforme |
| Backend | **Laravel 11** (PHP 8.3) | Document disait Node.js — migré en Laravel |
| Base de données | **SQLite** | Document disait PostgreSQL — SQLite retenu (suffisant EPS2) |
| Hébergement | Shipiix (à configurer) | Dockerfile prêt |

### Fichiers Docker
```
backend/
├── Dockerfile                  ✅ PHP 8.3-fpm + Nginx + Supervisor
├── docker/nginx.conf           ✅ reverse proxy Laravel
├── docker/supervisord.conf     ✅ php-fpm + nginx
└── docker/entrypoint.sh        ✅ migrate + seed auto au démarrage
```

**Commandes :**
```bash
# Build
docker build -t eps2-laravel ./backend

# Run (avec volume pour persister la DB SQLite)
docker run -p 8000:80 \
  -v eps2-db:/var/www/html/database \
  -e APP_KEY=base64:... \
  -e GOOGLE_CLIENT_ID=... \
  -e GOOGLE_CLIENT_SECRET=... \
  eps2-laravel
```

---

## 7. ORDRE D'EXÉCUTION DES MODIFICATIONS

```
1. Modifier DatabaseSeeder.php       → 6 users (rôles corrects)
2. Modifier UserController.php       → $rolesValides avec 6 rôles
3. php artisan migrate:fresh --seed  → recréer la DB proprement
4. Tester login avec chaque rôle     → vérifier les permissions
5. Configurer Google Cloud Console   → ajouter l'URI de callback
6. Tester la connexion Google        → vérifier le redirect frontend
7. Build Docker                      → docker build + docker run
8. Tester en production              → vérifier CORS_ALLOWED_ORIGINS
```

---

## 8. MODULES V2 (hors périmètre actuel)

Selon MoSCoW du rapport :
- **Facturation** — paiement + prise en charge assurance maladie
- **Interconnexion externe** — interopérabilité avec le système national de santé (MSAS)
- **Télémédecine**
- **Application mobile** (consultation dossier depuis tablette)
