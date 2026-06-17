// ---------------------------------------------------------------------------
//  API – Plateforme de gestion du dossier patient (EPS2)
//  Express + SQLite (sql.js). Rôles : Administrateur, Médecin, Utilisateur.
// ---------------------------------------------------------------------------
import express from "express";
import cors from "cors";
import crypto from "node:crypto";
import { exec, all, get, run, insert } from "./db.js";

// ---------------------------------------------------------------------------
//  Schéma
// ---------------------------------------------------------------------------
exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL, password TEXT NOT NULL,
  name TEXT NOT NULL, role TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL, nom TEXT NOT NULL, prenom TEXT NOT NULL,
  date_naissance TEXT, sexe TEXT, telephone TEXT, adresse TEXT,
  groupe_sanguin TEXT, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS consultations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL, date TEXT NOT NULL, medecin TEXT,
  motif TEXT, diagnostic TEXT, traitement TEXT,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS rendez_vous (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL, date TEXT NOT NULL, heure TEXT,
  medecin TEXT, motif TEXT, statut TEXT NOT NULL DEFAULT 'Planifié',
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);
`);

// ---------------------------------------------------------------------------
//  Rôles
// ---------------------------------------------------------------------------
const ROLE = { ADMIN: "Administrateur", MEDECIN: "Médecin", USER: "Utilisateur" };

// ---------------------------------------------------------------------------
//  Données de démonstration
// ---------------------------------------------------------------------------
function seed() {
  if (get("SELECT COUNT(*) AS n FROM users").n > 0) return;

  insert("INSERT INTO users (username,password,name,role) VALUES (?,?,?,?)", ["admin", "admin", "Administrateur Système", ROLE.ADMIN]);
  insert("INSERT INTO users (username,password,name,role) VALUES (?,?,?,?)", ["medecin", "medecin", "Dr. Amina Diallo", ROLE.MEDECIN]);
  insert("INSERT INTO users (username,password,name,role) VALUES (?,?,?,?)", ["user", "user", "Awa Ndoye (Accueil)", ROLE.USER]);

  const today = new Date();
  const iso = (d) => d.toISOString().slice(0, 10);
  const addDays = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return iso(d); };
  const monthDay = (mAgo, day) => { const d = new Date(today.getFullYear(), today.getMonth() - mAgo, day); return iso(d); };

  const demo = [
    ["Ndiaye", "Fatou", "1988-04-12", "F", "77 123 45 67", "Dakar, Médina", "O+"],
    ["Sow", "Mamadou", "1975-09-30", "M", "78 234 56 78", "Pikine", "A+"],
    ["Faye", "Awa", "1995-01-22", "F", "76 345 67 89", "Guédiawaye", "B-"],
    ["Diop", "Cheikh", "1962-11-05", "M", "70 456 78 90", "Rufisque", "AB+"],
    ["Ba", "Aïssatou", "2001-07-18", "F", "77 567 89 01", "Thiès", "O-"],
    ["Gueye", "Ibrahima", "1958-03-09", "M", "78 678 90 12", "Dakar, Plateau", "A-"],
    ["Sarr", "Mariama", "1990-12-25", "F", "76 789 01 23", "Mbour", "B+"],
    ["Fall", "Ousmane", "1983-06-14", "M", "70 890 12 34", "Kaolack", "O+"],
    ["Diallo", "Khady", "2015-02-03", "F", "77 901 23 45", "Saint-Louis", "AB-"],
    ["Cissé", "Modou", "1970-10-21", "M", "78 012 34 56", "Ziguinchor", "A+"],
    ["Sy", "Ndeye", "1998-08-30", "F", "76 123 45 60", "Dakar, Yoff", "O+"],
    ["Kane", "Abdou", "1948-05-17", "M", "70 234 56 71", "Touba", "B+"],
  ];
  const ids = demo.map((p) => insert(
    "INSERT INTO patients (code,nom,prenom,date_naissance,sexe,telephone,adresse,groupe_sanguin,created_at) VALUES (?,?,?,?,?,?,?,?,?)",
    ["PAT-" + String(demo.indexOf(p) + 1).padStart(4, "0"), ...p, iso(today)]
  ));

  const motifs = [
    ["Fièvre persistante", "Paludisme simple", "Artéméther-luméfantrine, repos"],
    ["Douleurs thoraciques", "Hypertension artérielle", "Amlodipine 5 mg, suivi tensionnel"],
    ["Toux et fièvre", "Infection respiratoire", "Amoxicilline, hydratation"],
    ["Contrôle de grossesse", "Grossesse évolutive normale", "Acide folique, fer"],
    ["Céphalées", "Migraine", "Paracétamol, repos"],
    ["Douleurs abdominales", "Gastrite", "Oméprazole, régime"],
    ["Contrôle diabète", "Diabète type 2 équilibré", "Metformine, suivi glycémique"],
    ["Plaie infectée", "Infection cutanée", "Antibiotique local, pansement"],
  ];
  // Consultations réparties sur 6 mois
  let cIdx = 0;
  for (let m = 5; m >= 0; m--) {
    const nb = [3, 4, 5, 6, 5, 7][5 - m]; // progression
    for (let k = 0; k < nb; k++) {
      const mt = motifs[cIdx % motifs.length];
      const pid = ids[(cIdx * 3 + k) % ids.length];
      insert("INSERT INTO consultations (patient_id,date,medecin,motif,diagnostic,traitement) VALUES (?,?,?,?,?,?)",
        [pid, monthDay(m, 3 + ((k * 4) % 24)), "Dr. Amina Diallo", mt[0], mt[1], mt[2]]);
      cIdx++;
    }
  }

  // Rendez-vous variés (statuts)
  const rdv = [
    [ids[2], addDays(0), "09:30", "Consultation prénatale", "Planifié"],
    [ids[3], addDays(0), "11:00", "Suivi cardiologique", "Planifié"],
    [ids[1], addDays(2), "14:00", "Bilan tensionnel", "Planifié"],
    [ids[4], addDays(1), "10:15", "Consultation générale", "Planifié"],
    [ids[0], addDays(-3), "08:45", "Contrôle paludisme", "Honoré"],
    [ids[5], addDays(-5), "15:30", "Bilan cardiaque", "Honoré"],
    [ids[6], addDays(-2), "09:00", "Suivi grossesse", "Honoré"],
    [ids[7], addDays(-1), "16:00", "Contrôle diabète", "Annulé"],
    [ids[8], addDays(3), "11:30", "Vaccination", "Planifié"],
    [ids[9], addDays(-7), "13:00", "Consultation", "Honoré"],
  ];
  rdv.forEach((r) => insert(
    "INSERT INTO rendez_vous (patient_id,date,heure,medecin,motif,statut) VALUES (?,?,?,?,?,?)",
    [r[0], r[1], r[2], "Dr. Amina Diallo", r[3], r[4]]
  ));
}
seed();

// ---------------------------------------------------------------------------
//  Authentification + autorisation par rôle
// ---------------------------------------------------------------------------
const tokens = new Map();
function auth(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  const user = tokens.get(token);
  if (!user) return res.status(401).json({ error: "Non authentifié" });
  req.user = user;
  next();
}
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ error: "Accès refusé : autorisation insuffisante" });
  next();
};

// ---------------------------------------------------------------------------
//  Application
// ---------------------------------------------------------------------------
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  const user = get("SELECT * FROM users WHERE username = ?", [username]);
  if (!user || user.password !== password)
    return res.status(401).json({ error: "Identifiant ou mot de passe incorrect" });
  const token = crypto.randomBytes(24).toString("hex");
  const safeUser = { id: user.id, username: user.username, name: user.name, role: user.role };
  tokens.set(token, safeUser);
  res.json({ token, user: safeUser });
});

// --- KPI / Tableau de bord ---
app.get("/api/kpis", auth, (req, res) => {
  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);

  const totals = {
    patients: get("SELECT COUNT(*) AS n FROM patients").n,
    consultations: get("SELECT COUNT(*) AS n FROM consultations").n,
    rdvAujourdhui: get("SELECT COUNT(*) AS n FROM rendez_vous WHERE date = ?", [todayIso]).n,
    rdvPlanifies: get("SELECT COUNT(*) AS n FROM rendez_vous WHERE statut = 'Planifié'").n,
  };

  // Consultations sur les 6 derniers mois
  const LABELS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
  const consultationsParMois = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const n = get("SELECT COUNT(*) AS n FROM consultations WHERE substr(date,1,7) = ?", [key]).n;
    consultationsParMois.push({ label: LABELS[d.getMonth()], total: n });
  }

  // Patients par sexe
  const patientsParSexe = [
    { name: "Féminin", value: get("SELECT COUNT(*) AS n FROM patients WHERE sexe='F'").n },
    { name: "Masculin", value: get("SELECT COUNT(*) AS n FROM patients WHERE sexe='M'").n },
  ];

  // Rendez-vous par statut
  const rdvParStatut = ["Planifié", "Honoré", "Annulé"].map((s) => ({
    name: s, value: get("SELECT COUNT(*) AS n FROM rendez_vous WHERE statut=?", [s]).n,
  }));

  // Patients par tranche d'âge
  const patients = all("SELECT date_naissance FROM patients");
  const buckets = { "0-17": 0, "18-39": 0, "40-59": 0, "60+": 0 };
  patients.forEach((p) => {
    if (!p.date_naissance) return;
    const age = Math.floor((Date.now() - new Date(p.date_naissance)) / (365.25 * 864e5));
    if (age < 18) buckets["0-17"]++;
    else if (age < 40) buckets["18-39"]++;
    else if (age < 60) buckets["40-59"]++;
    else buckets["60+"]++;
  });
  const patientsParTranche = Object.entries(buckets).map(([name, value]) => ({ name, value }));

  res.json({ totals, consultationsParMois, patientsParSexe, rdvParStatut, patientsParTranche });
});

// --- Patients ---
app.get("/api/patients", auth, (req, res) => {
  const q = `%${(req.query.q || "").trim()}%`;
  res.json(all("SELECT * FROM patients WHERE nom LIKE ? OR prenom LIKE ? OR code LIKE ? ORDER BY nom, prenom", [q, q, q]));
});
app.get("/api/patients/:id", auth, (req, res) => {
  const patient = get("SELECT * FROM patients WHERE id = ?", [req.params.id]);
  if (!patient) return res.status(404).json({ error: "Patient introuvable" });
  patient.consultations = all("SELECT * FROM consultations WHERE patient_id = ? ORDER BY date DESC", [patient.id]);
  patient.rendezvous = all("SELECT * FROM rendez_vous WHERE patient_id = ? ORDER BY date DESC, heure", [patient.id]);
  res.json(patient);
});
app.post("/api/patients", auth, requireRole(ROLE.ADMIN, ROLE.MEDECIN, ROLE.USER), (req, res) => {
  const b = req.body || {};
  if (!b.nom || !b.prenom) return res.status(400).json({ error: "Nom et prénom requis" });
  const n = get("SELECT COUNT(*) AS n FROM patients").n;
  const code = "PAT-" + String(n + 1).padStart(4, "0");
  const id = insert(
    "INSERT INTO patients (code,nom,prenom,date_naissance,sexe,telephone,adresse,groupe_sanguin,created_at) VALUES (?,?,?,?,?,?,?,?,?)",
    [code, b.nom, b.prenom, b.date_naissance || null, b.sexe || null, b.telephone || null, b.adresse || null, b.groupe_sanguin || null, new Date().toISOString().slice(0, 10)]
  );
  res.status(201).json(get("SELECT * FROM patients WHERE id = ?", [id]));
});
app.delete("/api/patients/:id", auth, requireRole(ROLE.ADMIN), (req, res) => {
  run("DELETE FROM patients WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

// --- Consultations (acte clinique : Médecin / Admin) ---
app.get("/api/consultations", auth, requireRole(ROLE.ADMIN, ROLE.MEDECIN), (req, res) => {
  res.json(all(`SELECT c.*, p.nom, p.prenom, p.code FROM consultations c
     JOIN patients p ON p.id = c.patient_id ORDER BY c.date DESC LIMIT 50`));
});
app.post("/api/consultations", auth, requireRole(ROLE.ADMIN, ROLE.MEDECIN), (req, res) => {
  const b = req.body || {};
  if (!b.patient_id) return res.status(400).json({ error: "Patient requis" });
  const id = insert(
    "INSERT INTO consultations (patient_id,date,medecin,motif,diagnostic,traitement) VALUES (?,?,?,?,?,?)",
    [b.patient_id, b.date || new Date().toISOString().slice(0, 10), b.medecin || req.user.name, b.motif || null, b.diagnostic || null, b.traitement || null]
  );
  res.status(201).json(get("SELECT * FROM consultations WHERE id = ?", [id]));
});

// --- Rendez-vous ---
app.get("/api/rendezvous", auth, (req, res) => {
  res.json(all(`SELECT r.*, p.nom, p.prenom, p.code FROM rendez_vous r
     JOIN patients p ON p.id = r.patient_id ORDER BY r.date, r.heure`));
});
app.post("/api/rendezvous", auth, requireRole(ROLE.ADMIN, ROLE.MEDECIN, ROLE.USER), (req, res) => {
  const b = req.body || {};
  if (!b.patient_id || !b.date) return res.status(400).json({ error: "Patient et date requis" });
  const id = insert(
    "INSERT INTO rendez_vous (patient_id,date,heure,medecin,motif,statut) VALUES (?,?,?,?,?,?)",
    [b.patient_id, b.date, b.heure || null, b.medecin || req.user.name, b.motif || null, b.statut || "Planifié"]
  );
  res.status(201).json(get("SELECT * FROM rendez_vous WHERE id = ?", [id]));
});
app.patch("/api/rendezvous/:id", auth, requireRole(ROLE.ADMIN, ROLE.MEDECIN, ROLE.USER), (req, res) => {
  run("UPDATE rendez_vous SET statut = ? WHERE id = ?", [req.body?.statut, req.params.id]);
  res.json(get("SELECT * FROM rendez_vous WHERE id = ?", [req.params.id]));
});

// --- Utilisateurs (Administrateur uniquement) ---
app.get("/api/users", auth, requireRole(ROLE.ADMIN), (req, res) => {
  res.json(all("SELECT id, username, name, role FROM users ORDER BY role, name"));
});
app.post("/api/users", auth, requireRole(ROLE.ADMIN), (req, res) => {
  const b = req.body || {};
  if (!b.username || !b.password || !b.name || !b.role)
    return res.status(400).json({ error: "Tous les champs sont requis" });
  if (![ROLE.ADMIN, ROLE.MEDECIN, ROLE.USER].includes(b.role))
    return res.status(400).json({ error: "Rôle invalide" });
  if (get("SELECT id FROM users WHERE username = ?", [b.username]))
    return res.status(400).json({ error: "Cet identifiant existe déjà" });
  const id = insert("INSERT INTO users (username,password,name,role) VALUES (?,?,?,?)",
    [b.username, b.password, b.name, b.role]);
  res.status(201).json(get("SELECT id, username, name, role FROM users WHERE id = ?", [id]));
});
app.delete("/api/users/:id", auth, requireRole(ROLE.ADMIN), (req, res) => {
  if (Number(req.params.id) === req.user.id)
    return res.status(400).json({ error: "Vous ne pouvez pas supprimer votre propre compte" });
  run("DELETE FROM users WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API EPS2 démarrée sur http://localhost:${PORT}`));
