import { useEffect, useState } from "react";
import { api } from "../api.js";

const ROLE_COLOR = {
  "Administrateur": { bg:"#efe3c2", color:"#8a6a00" },
  "Médecin":        { bg:"#e2ecf6", color:"#2b5a8a" },
  "Utilisateur":    { bg:"var(--chip)", color:"var(--green-dk)" },
};

export default function ConnexionLog() {
  const [list,   setList]   = useState([]);
  const [filtre, setFiltre] = useState("");

  useEffect(() => { api.get("/api/connexions").then(setList).catch(() => {}); }, []);

  const filtered = filtre
    ? list.filter(c => c.role === filtre)
    : list;

  return (
    <div>
      <div className="page-head">
        <h1>Historique des connexions</h1>
        <p>Journal de toutes les connexions à la plateforme — 200 dernières entrées.</p>
      </div>

      <div className="toolbar" style={{ marginBottom: 18 }}>
        <div style={{ display:"flex", gap:8 }}>
          {["","Administrateur","Médecin","Utilisateur"].map(r => (
            <button
              key={r}
              className={`btn sm ${filtre === r ? "" : "ghost"}`}
              onClick={() => setFiltre(r)}
            >
              {r || "Tous"}
            </button>
          ))}
        </div>
        <span style={{ fontSize:13, color:"var(--muted)" }}>
          {filtered.length} entrée{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding:0 }}>
          {filtered.length === 0 ? (
            <div className="empty">Aucune connexion enregistrée.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Utilisateur</th>
                  <th>Rôle</th>
                  <th>Date</th>
                  <th>Heure</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => {
                  const style = ROLE_COLOR[c.role] || {};
                  return (
                    <tr key={c.id}>
                      <td style={{ color:"var(--muted)", fontSize:12 }}>{filtered.length - i}</td>
                      <td>
                        <div style={{ fontWeight:600 }}>{c.name}</div>
                        <div style={{ fontSize:12, color:"var(--muted)" }}>{c.username}</div>
                      </td>
                      <td>
                        <span className="badge" style={{ background:style.bg, color:style.color }}>
                          {c.role}
                        </span>
                      </td>
                      <td>{c.date ? c.date.split("-").reverse().join("/") : "—"}</td>
                      <td style={{ fontWeight:600 }}>{c.heure}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
