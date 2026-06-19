export function fmtDate(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function age(iso) {
  if (!iso) return "—";
  return Math.floor((Date.now() - new Date(iso)) / (365.25 * 24 * 3600 * 1000)) + " ans";
}

export function statusBadge(statut) {
  const map = { "Planifié": "blue", "Honoré": "green", "Annulé": "red" };
  return map[statut] || "blue";
}

export function hospBadge(statut) {
  const map = { "En cours": "green", "Sorti": "blue", "Transféré": "amber" };
  return map[statut] || "blue";
}

export function analyseBadge(statut) {
  const map = { "En attente": "amber", "En cours": "blue", "Résultat disponible": "green" };
  return map[statut] || "blue";
}

export function ordoBadge(statut) {
  const map = { "En attente": "amber", "Dispensée": "green", "Partielle": "blue" };
  return map[statut] || "blue";
}
