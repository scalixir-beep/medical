// Matrice de permissions par rôle (miroir du backend).
export const PERMS = {
  "Administrateur": { dashboard: 1, patients: 1, patientCreate: 1, patientDelete: 1, consultations: 1, consultationCreate: 1, rendezvous: 1, users: 1 },
  "Médecin":        { dashboard: 1, patients: 1, patientCreate: 1, patientDelete: 0, consultations: 1, consultationCreate: 1, rendezvous: 1, users: 0 },
  "Utilisateur":    { dashboard: 1, patients: 1, patientCreate: 1, patientDelete: 0, consultations: 0, consultationCreate: 0, rendezvous: 1, users: 0 },
};

export function can(user, action) {
  return !!(user && PERMS[user.role] && PERMS[user.role][action]);
}

export function roleClass(role) {
  if (role === "Administrateur") return "admin";
  if (role === "Médecin") return "medecin";
  return "user";
}
