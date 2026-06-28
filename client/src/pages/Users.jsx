import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";
import { roleClass } from "../perms.js";

const ROLES = [
  { value:"Administrateur", desc:"Accès complet à tous les modules" },
  { value:"Médecin",        desc:"Actes cliniques, prescriptions, hospitalisations" },
  { value:"Infirmier",      desc:"Soins, hospitalisation (lecture), RDV" },
  { value:"Accueil",        desc:"Enregistrement patients, rendez-vous" },
  { value:"Pharmacien",     desc:"Dispensation ordonnances, gestion du stock" },
  { value:"Biologiste",     desc:"Saisie des résultats d'analyses" },
];

const EMPTY = { name:"", username:"", password:"", role:"Médecin" };

export default function Users() {
  const { user } = useAuth();
  const [list,  setList]  = useState([]);
  const [form,  setForm]  = useState(EMPTY);
  const [show,  setShow]  = useState(false);
  const [error, setError] = useState("");

  function load() { api.get("/api/users").then(setList).catch(() => {}); }
  useEffect(() => { load(); }, []);

  const set = k => e => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault(); setError("");
    try { await api.post("/api/users", form); setForm(EMPTY); setShow(false); load(); }
    catch (err) { setError(err.message); }
  }
  async function remove(id) {
    if (!confirm("Supprimer ce compte utilisateur ?")) return;
    try { await api.del(`/api/users/${id}`); load(); }
    catch (err) { alert(err.message); }
  }

  const selectedRole = ROLES.find(r => r.value === form.role);

  return (
    <div>
      <div className="page-head">
        <h1>Utilisateurs</h1>
        <p>Gérez les comptes et les rôles d'accès à la plateforme.</p>
      </div>

      <div className="toolbar">
        <div className="notice">
          <b>6 rôles métier CHRASNT</b> — chaque rôle accède uniquement aux modules de sa fonction.
        </div>
        <button className="btn" onClick={() => { setShow(s => !s); setError(""); }}>
          {show ? "Fermer" : "+ Nouveau compte"}
        </button>
      </div>

      {show && (
        <div className="card" style={{ marginBottom:18 }}>
          <div className="card-head"><h2>Créer un compte</h2></div>
          <div className="card-body">
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={submit}>
              <div className="form-grid">
                <label className="field">
                  <span>Nom complet *</span>
                  <input value={form.name} onChange={set("name")} required/>
                </label>
                <label className="field">
                  <span>Rôle *</span>
                  <select value={form.role} onChange={set("role")}>
                    {ROLES.map(r => (
                      <option key={r.value} value={r.value}>{r.value}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Identifiant *</span>
                  <input value={form.username} onChange={set("username")} required/>
                </label>
                <label className="field">
                  <span>Mot de passe *</span>
                  <input value={form.password} onChange={set("password")} required/>
                </label>
              </div>
              {selectedRole && (
                <div className="notice" style={{ marginBottom:12 }}>
                  <b>{selectedRole.value}</b> — {selectedRole.desc}
                </div>
              )}
              <div className="form-actions">
                <button className="btn">Créer le compte</button>
                <button type="button" className="btn ghost" onClick={() => { setShow(false); setError(""); }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card"><div className="card-body" style={{ padding:0 }}>
        <table>
          <thead>
            <tr><th>Nom</th><th>Identifiant</th><th>Rôle</th><th>Accès</th><th></th></tr>
          </thead>
          <tbody>
            {list.map(u => (
              <tr key={u.id}>
                <td style={{ fontWeight:600 }}>{u.name}</td>
                <td><span className="code">{u.username}</span></td>
                <td><span className={`role-badge ${roleClass(u.role)}`}>{u.role}</span></td>
                <td style={{ fontSize:12, color:"var(--muted)" }}>
                  {ROLES.find(r => r.value === u.role)?.desc || "—"}
                </td>
                <td style={{ textAlign:"right" }}>
                  {u.id !== user.id
                    ? <button className="btn danger sm" onClick={() => remove(u.id)}>Supprimer</button>
                    : <span style={{ color:"var(--muted)", fontSize:12 }}>Vous</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>
    </div>
  );
}
