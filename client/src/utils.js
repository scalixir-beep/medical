export function fmtDate(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function age(iso) {
  if (!iso) return "—";
  const birth = new Date(iso);
  const diff = Date.now() - birth.getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000)) + " ans";
}

export function statusBadge(statut) {
  const map = {
    "Planifié": "blue",
    "Honoré": "green",
    "Annulé": "red",
  };
  return map[statut] || "blue";
}
