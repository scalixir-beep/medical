// Matrice complète des permissions — 6 rôles métier EPS2
// Chaque clé correspond à une action vérifiée avec can(user, action)

const A = 1, X = 0; // raccourcis lisibilité

export const PERMS = {
  // ── Administrateur : accès total ──
  "Administrateur": {
    dashboard:1, patients:1, patientCreate:1, patientDelete:1,
    consultations:1, consultationCreate:1,
    rendezvous:1,
    hospitalisation:1, hospitalisationCreate:1,
    laboratoire:1, laboDemande:1, laboResultats:1,
    pharmacie:1, pharmacieOrdonnance:1, pharmacieDispenser:1, pharmacieStock:1,
    users:1, connexions:1,
  },

  // ── Médecin : actes cliniques complets ──
  "Médecin": {
    dashboard:A, patients:A, patientCreate:A, patientDelete:X,
    consultations:A, consultationCreate:A,
    rendezvous:A,
    hospitalisation:A, hospitalisationCreate:A,      // admet ET sort les patients
    laboratoire:A, laboDemande:A, laboResultats:X,   // prescrit analyses, ne saisit pas résultats
    pharmacie:A, pharmacieOrdonnance:A, pharmacieDispenser:X, pharmacieStock:X, // prescrit, ne dispense pas
    users:X, connexions:X,
  },

  // ── Sage-femme : maternité + pédiatrie ──
  "Sage-femme": {
    dashboard:A, patients:A, patientCreate:A, patientDelete:X,
    consultations:A, consultationCreate:A,            // consultations prénatales
    rendezvous:A,
    hospitalisation:A, hospitalisationCreate:A,       // admet et sort en maternité
    laboratoire:A, laboDemande:A, laboResultats:X,    // prescrit analyses
    pharmacie:A, pharmacieOrdonnance:A, pharmacieDispenser:X, pharmacieStock:X,
    users:X, connexions:X,
  },

  // ── Infirmier : soins et suivi hospitalier ──
  "Infirmier": {
    dashboard:A, patients:A, patientCreate:X, patientDelete:X,
    consultations:X, consultationCreate:X,
    rendezvous:A,                                     // consulte et planifie les RDV
    hospitalisation:A, hospitalisationCreate:X,       // voit les séjours, ne peut pas admettre/sortir
    laboratoire:X, laboDemande:X, laboResultats:X,
    pharmacie:X, pharmacieOrdonnance:X, pharmacieDispenser:X, pharmacieStock:X,
    users:X, connexions:X,
  },

  // ── Accueil : admission et planning ──
  "Accueil": {
    dashboard:A, patients:A, patientCreate:A, patientDelete:X,
    consultations:X, consultationCreate:X,
    rendezvous:A,
    hospitalisation:X, hospitalisationCreate:X,
    laboratoire:X, laboDemande:X, laboResultats:X,
    pharmacie:X, pharmacieOrdonnance:X, pharmacieDispenser:X, pharmacieStock:X,
    users:X, connexions:X,
  },

  // ── Pharmacien : pharmacie uniquement ──
  "Pharmacien": {
    dashboard:A, patients:A, patientCreate:X, patientDelete:X,
    consultations:X, consultationCreate:X,
    rendezvous:X,
    hospitalisation:X, hospitalisationCreate:X,
    laboratoire:X, laboDemande:X, laboResultats:X,
    pharmacie:A, pharmacieOrdonnance:X, pharmacieDispenser:A, pharmacieStock:A, // dispense et gère stock
    users:X, connexions:X,
  },

  // ── Biologiste : laboratoire uniquement ──
  "Biologiste": {
    dashboard:A, patients:A, patientCreate:X, patientDelete:X,
    consultations:X, consultationCreate:X,
    rendezvous:X,
    hospitalisation:X, hospitalisationCreate:X,
    laboratoire:A, laboDemande:X, laboResultats:A,   // ne prescrit pas, saisit les résultats
    pharmacie:X, pharmacieOrdonnance:X, pharmacieDispenser:X, pharmacieStock:X,
    users:X, connexions:X,
  },

  // Rétro-compatibilité : ancien rôle "Utilisateur" = Accueil
  "Utilisateur": {
    dashboard:A, patients:A, patientCreate:A, patientDelete:X,
    consultations:X, consultationCreate:X,
    rendezvous:A,
    hospitalisation:X, hospitalisationCreate:X,
    laboratoire:X, laboDemande:X, laboResultats:X,
    pharmacie:X, pharmacieOrdonnance:X, pharmacieDispenser:X, pharmacieStock:X,
    users:X, connexions:X,
  },
};

export function can(user, action) {
  return !!(user && PERMS[user.role]?.[action]);
}

export function roleClass(role) {
  const map = {
    "Administrateur": "admin",
    "Médecin":        "medecin",
    "Sage-femme":     "sagefemme",
    "Infirmier":      "infirmier",
    "Accueil":        "accueil",
    "Pharmacien":     "pharmacien",
    "Biologiste":     "biologiste",
    "Utilisateur":    "accueil",
  };
  return map[role] || "accueil";
}
