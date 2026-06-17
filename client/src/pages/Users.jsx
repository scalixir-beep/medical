import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";
import { roleClass } from "../perms.js";

const EMPTY = { name: "", username: "", password: "", role: "Médecin" };

export default function Users() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  function load() { api.get("/api/users").then(setList).catch(() => {}); }
  useEffect(() => { load(); }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

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

  return (
    <div>
      <div className="page-head">
        <h1>Utilisateurs</h1>
        <p>Gérez les comptes et les rôles d'accès à la plateforme.</p>
      </div>

      <div className="toolbar">
        <div className="notice">Trois rôles : <b>Administrateur</b> (accès total), <b>Médecin</b> (actes cliniques), <b>Utilisateur</b> (accueil).</div>
        <button className="btn" onClick={() => setShow((s) => !s)}>{show ? "Fermer" : "+ Nouveau compte"}</button>
      </div>

      {show && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="card-head"><h2>Créer un compte</h2></div>
          <div className="card-body">
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={submit}>
              <div className="form-grid">
                <label className="field"><span>Nom complet *</span><input value={form.name} onChange={set("name")} required /></label>
                <label className="field"><span>Rôle *</span>
                  <select value={form.role} onChange={set("role")}>
                    <option>Administrateur</option><option>Médecin</option><option>Utilisateur</option>
                  </select>
                </label>
                <label className="field"><span>Identifiant *</span><input value={form.username} onChange={set("username")} required /></label>
                <label className="field"><span>Mot de passe *</span><input value={form.password} onChange={set("password")} required /></label>
              </div>
              <div className="form-actions">
                <button className="btn">Créer le compte</button>
                <button type="button" className="btn ghost" onClick={() => { setShow(false); setError(""); }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card"><div className="card-body" style={{ padding: 0 }}>
        <table>
          <thead><tr><th>Nom</th><th>Identifiant</th><th>Rôle</th><th></th></tr></thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td><span className="code">{u.username}</span></td>
                <td><span className={`role-badge ${roleClass(u.role)}`}>{u.role}</span></td>
                <td style={{ textAlign: "right" }}>
                  {u.id !== user.id
                    ? <button className="btn danger sm" onClick={() => remove(u.id)}>Supprimer</button>
                    : <span style={{ color: "var(--muted)", fontSize: 12 }}>Vous</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>
    </div>
  );
}
