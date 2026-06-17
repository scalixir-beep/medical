-- ============================================================
--  EPS2 – Dossier Patient
--  Schéma + données de démonstration
--  Moteur : SQLite (compatible sql.js)
--  Référence temporelle : 2026-06-17
--
--  Usage CLI SQLite :
--    sqlite3 data.db < medical.sql
--
--  Usage Node (sql.js) :
--    const sql = fs.readFileSync('medical.sql', 'utf8');
--    db.run(sql);
--
--  ⚠ Les mots de passe sont en clair (prototype).
--    En production, remplacer par des hachages bcrypt.
-- ============================================================

PRAGMA encoding     = 'UTF-8';
PRAGMA foreign_keys = ON;

-- ── Remise à zéro (décommenter si réinitialisation complète) ──
-- DROP TABLE IF EXISTS rendez_vous;
-- DROP TABLE IF EXISTS consultations;
-- DROP TABLE IF EXISTS patients;
-- DROP TABLE IF EXISTS users;

-- ═════════════════════════════════════════════════════════════
--  SCHÉMA
-- ═════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS users (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name     TEXT NOT NULL,
  role     TEXT NOT NULL CHECK (role IN ('Administrateur', 'Médecin', 'Utilisateur'))
);

CREATE TABLE IF NOT EXISTS patients (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  code           TEXT UNIQUE NOT NULL,
  nom            TEXT NOT NULL,
  prenom         TEXT NOT NULL,
  date_naissance TEXT,
  sexe           TEXT CHECK (sexe IN ('M', 'F')),
  telephone      TEXT,
  adresse        TEXT,
  groupe_sanguin TEXT,
  created_at     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS consultations (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  date       TEXT    NOT NULL,
  medecin    TEXT,
  motif      TEXT,
  diagnostic TEXT,
  traitement TEXT,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rendez_vous (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  date       TEXT    NOT NULL,
  heure      TEXT,
  medecin    TEXT,
  motif      TEXT,
  statut     TEXT NOT NULL DEFAULT 'Planifié'
             CHECK (statut IN ('Planifié', 'Honoré', 'Annulé')),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- ═════════════════════════════════════════════════════════════
--  DONNÉES DE DÉMONSTRATION
-- ═════════════════════════════════════════════════════════════

BEGIN TRANSACTION;

-- ── Utilisateurs ─────────────────────────────────────────────
-- Rôles : Administrateur · Médecin · Utilisateur (accueil)

INSERT INTO users (id, username, password, name, role) VALUES
  (1, 'admin',   'admin',   'Administrateur Système', 'Administrateur'),
  (2, 'medecin', 'medecin', 'Dr. Amina Diallo',       'Médecin'),
  (3, 'user',    'user',    'Awa Ndoye (Accueil)',     'Utilisateur');

-- ── Patients (12 dossiers) ───────────────────────────────────

INSERT INTO patients
  (id, code, nom, prenom, date_naissance, sexe, telephone, adresse, groupe_sanguin, created_at)
VALUES
  (1,  'PAT-0001', 'Ndiaye', 'Fatou',    '1988-04-12', 'F', '77 123 45 67', 'Dakar, Médina',  'O+',  '2026-06-17'),
  (2,  'PAT-0002', 'Sow',    'Mamadou',  '1975-09-30', 'M', '78 234 56 78', 'Pikine',          'A+',  '2026-06-17'),
  (3,  'PAT-0003', 'Faye',   'Awa',      '1995-01-22', 'F', '76 345 67 89', 'Guédiawaye',      'B-',  '2026-06-17'),
  (4,  'PAT-0004', 'Diop',   'Cheikh',   '1962-11-05', 'M', '70 456 78 90', 'Rufisque',        'AB+', '2026-06-17'),
  (5,  'PAT-0005', 'Ba',     'Aïssatou', '2001-07-18', 'F', '77 567 89 01', 'Thiès',           'O-',  '2026-06-17'),
  (6,  'PAT-0006', 'Gueye',  'Ibrahima', '1958-03-09', 'M', '78 678 90 12', 'Dakar, Plateau',  'A-',  '2026-06-17'),
  (7,  'PAT-0007', 'Sarr',   'Mariama',  '1990-12-25', 'F', '76 789 01 23', 'Mbour',           'B+',  '2026-06-17'),
  (8,  'PAT-0008', 'Fall',   'Ousmane',  '1983-06-14', 'M', '70 890 12 34', 'Kaolack',         'O+',  '2026-06-17'),
  (9,  'PAT-0009', 'Diallo', 'Khady',    '2015-02-03', 'F', '77 901 23 45', 'Saint-Louis',     'AB-', '2026-06-17'),
  (10, 'PAT-0010', 'Cissé',  'Modou',    '1970-10-21', 'M', '78 012 34 56', 'Ziguinchor',      'A+',  '2026-06-17'),
  (11, 'PAT-0011', 'Sy',     'Ndeye',    '1998-08-30', 'F', '76 123 45 60', 'Dakar, Yoff',     'O+',  '2026-06-17'),
  (12, 'PAT-0012', 'Kane',   'Abdou',    '1948-05-17', 'M', '70 234 56 71', 'Touba',           'B+',  '2026-06-17');

-- ── Consultations (30 actes sur 6 mois) ──────────────────────
-- Distribution : Jan=3  Fév=4  Mar=5  Avr=6  Mai=5  Juin=7

INSERT INTO consultations
  (id, patient_id, date, medecin, motif, diagnostic, traitement)
VALUES
  -- Janvier 2026 (3)
  (1,  1,  '2026-01-03', 'Dr. Amina Diallo', 'Fièvre persistante',    'Paludisme simple',            'Artéméther-luméfantrine, repos'),
  (2,  5,  '2026-01-07', 'Dr. Amina Diallo', 'Douleurs thoraciques',  'Hypertension artérielle',     'Amlodipine 5 mg, suivi tensionnel'),
  (3,  9,  '2026-01-11', 'Dr. Amina Diallo', 'Toux et fièvre',        'Infection respiratoire',      'Amoxicilline, hydratation'),

  -- Février 2026 (4)
  (4,  10, '2026-02-03', 'Dr. Amina Diallo', 'Contrôle de grossesse', 'Grossesse évolutive normale', 'Acide folique, fer'),
  (5,  2,  '2026-02-07', 'Dr. Amina Diallo', 'Céphalées',             'Migraine',                    'Paracétamol, repos'),
  (6,  6,  '2026-02-11', 'Dr. Amina Diallo', 'Douleurs abdominales',  'Gastrite',                    'Oméprazole, régime'),
  (7,  10, '2026-02-15', 'Dr. Amina Diallo', 'Contrôle diabète',      'Diabète type 2 équilibré',    'Metformine, suivi glycémique'),

  -- Mars 2026 (5)
  (8,  10, '2026-03-03', 'Dr. Amina Diallo', 'Plaie infectée',        'Infection cutanée',           'Antibiotique local, pansement'),
  (9,  2,  '2026-03-07', 'Dr. Amina Diallo', 'Fièvre persistante',    'Paludisme simple',            'Artéméther-luméfantrine, repos'),
  (10, 6,  '2026-03-11', 'Dr. Amina Diallo', 'Douleurs thoraciques',  'Hypertension artérielle',     'Amlodipine 5 mg, suivi tensionnel'),
  (11, 10, '2026-03-15', 'Dr. Amina Diallo', 'Toux et fièvre',        'Infection respiratoire',      'Amoxicilline, hydratation'),
  (12, 2,  '2026-03-19', 'Dr. Amina Diallo', 'Contrôle de grossesse', 'Grossesse évolutive normale', 'Acide folique, fer'),

  -- Avril 2026 (6)
  (13, 1,  '2026-04-03', 'Dr. Amina Diallo', 'Céphalées',             'Migraine',                    'Paracétamol, repos'),
  (14, 5,  '2026-04-07', 'Dr. Amina Diallo', 'Douleurs abdominales',  'Gastrite',                    'Oméprazole, régime'),
  (15, 9,  '2026-04-11', 'Dr. Amina Diallo', 'Contrôle diabète',      'Diabète type 2 équilibré',    'Metformine, suivi glycémique'),
  (16, 1,  '2026-04-15', 'Dr. Amina Diallo', 'Plaie infectée',        'Infection cutanée',           'Antibiotique local, pansement'),
  (17, 5,  '2026-04-19', 'Dr. Amina Diallo', 'Fièvre persistante',    'Paludisme simple',            'Artéméther-luméfantrine, repos'),
  (18, 9,  '2026-04-23', 'Dr. Amina Diallo', 'Douleurs thoraciques',  'Hypertension artérielle',     'Amlodipine 5 mg, suivi tensionnel'),

  -- Mai 2026 (5)
  (19, 7,  '2026-05-03', 'Dr. Amina Diallo', 'Toux et fièvre',        'Infection respiratoire',      'Amoxicilline, hydratation'),
  (20, 11, '2026-05-07', 'Dr. Amina Diallo', 'Contrôle de grossesse', 'Grossesse évolutive normale', 'Acide folique, fer'),
  (21, 3,  '2026-05-11', 'Dr. Amina Diallo', 'Céphalées',             'Migraine',                    'Paracétamol, repos'),
  (22, 7,  '2026-05-15', 'Dr. Amina Diallo', 'Douleurs abdominales',  'Gastrite',                    'Oméprazole, régime'),
  (23, 11, '2026-05-19', 'Dr. Amina Diallo', 'Contrôle diabète',      'Diabète type 2 équilibré',    'Metformine, suivi glycémique'),

  -- Juin 2026 (7)
  (24, 10, '2026-06-03', 'Dr. Amina Diallo', 'Plaie infectée',        'Infection cutanée',           'Antibiotique local, pansement'),
  (25, 2,  '2026-06-07', 'Dr. Amina Diallo', 'Fièvre persistante',    'Paludisme simple',            'Artéméther-luméfantrine, repos'),
  (26, 6,  '2026-06-11', 'Dr. Amina Diallo', 'Douleurs thoraciques',  'Hypertension artérielle',     'Amlodipine 5 mg, suivi tensionnel'),
  (27, 10, '2026-06-15', 'Dr. Amina Diallo', 'Toux et fièvre',        'Infection respiratoire',      'Amoxicilline, hydratation'),
  (28, 2,  '2026-06-19', 'Dr. Amina Diallo', 'Contrôle de grossesse', 'Grossesse évolutive normale', 'Acide folique, fer'),
  (29, 6,  '2026-06-23', 'Dr. Amina Diallo', 'Céphalées',             'Migraine',                    'Paracétamol, repos'),
  (30, 10, '2026-06-27', 'Dr. Amina Diallo', 'Douleurs abdominales',  'Gastrite',                    'Oméprazole, régime');

-- ── Rendez-vous (10 entrées) ──────────────────────────────────
-- Référence : aujourd'hui = 2026-06-17
-- Planifié : +3 j à 0 j  |  Honoré : -1 à -7 j  |  Annulé : 1 entrée

INSERT INTO rendez_vous
  (id, patient_id, date, heure, medecin, motif, statut)
VALUES
  (1,  3,  '2026-06-17', '09:30', 'Dr. Amina Diallo', 'Consultation prénatale', 'Planifié'),
  (2,  4,  '2026-06-17', '11:00', 'Dr. Amina Diallo', 'Suivi cardiologique',    'Planifié'),
  (3,  5,  '2026-06-18', '10:15', 'Dr. Amina Diallo', 'Consultation générale',  'Planifié'),
  (4,  2,  '2026-06-19', '14:00', 'Dr. Amina Diallo', 'Bilan tensionnel',       'Planifié'),
  (5,  9,  '2026-06-20', '11:30', 'Dr. Amina Diallo', 'Vaccination',            'Planifié'),
  (6,  1,  '2026-06-14', '08:45', 'Dr. Amina Diallo', 'Contrôle paludisme',     'Honoré'),
  (7,  7,  '2026-06-15', '09:00', 'Dr. Amina Diallo', 'Suivi grossesse',        'Honoré'),
  (8,  8,  '2026-06-16', '16:00', 'Dr. Amina Diallo', 'Contrôle diabète',       'Annulé'),
  (9,  6,  '2026-06-12', '15:30', 'Dr. Amina Diallo', 'Bilan cardiaque',        'Honoré'),
  (10, 10, '2026-06-10', '13:00', 'Dr. Amina Diallo', 'Consultation',           'Honoré');

COMMIT;

-- ── Vérification rapide ──────────────────────────────────────
-- SELECT 'users'         AS tbl, COUNT(*) AS n FROM users
-- UNION ALL
-- SELECT 'patients',        COUNT(*) FROM patients
-- UNION ALL
-- SELECT 'consultations',   COUNT(*) FROM consultations
-- UNION ALL
-- SELECT 'rendez_vous',     COUNT(*) FROM rendez_vous;
-- Attendu : 3 | 12 | 30 | 10
