import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { fmtDate, age } from "../utils.js";

const EMPTY = { nom: "", prenom: "", date_naissance: "", sexe: "F", telephone: "", adresse: "", groupe_sanguin: "" };

export default function Patients() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function load(query = "") {
    api.get(`/api/patients?q=${encodeURIComponent(query)}`).then(setList).catch(() => {});
  }
  useEffect(() => { load(); }, []);

  function onSearch(e) {
    setQ(e.target.value);
    load(e.target.value);
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/api/patients", form);
      setForm(EMPTY);
      setShowForm(false);
      load(q);
    } catch (err) {
      setError(err.message);
    }
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <div className="page-head">
        <h1>Patients</h1>
        <p>Recherchez, consultez et enregistrez les dossiers patients.</p>
      </div>

      <div className="toolbar">
        <div className="search">
          <input placeholder="Rechercher par nom, prénom ou code…" value={q} onChange={onSearch} />
        </div>
        <button className="btn" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Fermer" : "+ Nouveau patient"}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="card-head"><h2>Nouveau dossier patient</h2></div>
          <div className="card-body">
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={submit}>
              <div className="form-grid">
                <label className="field"><span>Nom *</span><input value={form.nom} onChange={set("nom")} required /></label>
                <label className="field"><span>Prénom *</span><input value={form.prenom} onChange={set("prenom")} required /></label>
                <label className="field"><span>Date de naissance</span><input type="date" value={form.date_naissance} onChange={set("date_naissance")} /></label>
                <label className="field"><span>Sexe</span>
                  <select value={form.sexe} onChange={set("sexe")}>
                    <option value="F">Féminin</option>
                    <option value="M">Masculin</option>
                  </select>
                </label>
                <label className="field"><span>Téléphone</span><input value={form.telephone} onChange={set("telephone")} /></label>
                <label className="field"><span>Groupe sanguin</span>
                  <select value={form.groupe_sanguin} onChange={set("groupe_sanguin")}>
                    <option value="">—</option>
                    {["O+","O-","A+","A-","B+","B-","AB+","AB-"].map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </label>
              </div>
              <label className="field"><span>Adresse</span><input value={form.adresse} onChange={set("adresse")} /></label>
              <div className="form-actions">
                <button className="btn">Enregistrer le patient</button>
                <button type="button" className="btn ghost" onClick={() => { setShowForm(false); setError(""); }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {list.length === 0 ? (
            <div className="empty">Aucun patient trouvé.</div>
          ) : (
            <table>
              <thead>
                <tr><th>Code</th><th>Nom complet</th><th>Sexe</th><th>Âge</th><th>Téléphone</th><th>Groupe</th></tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id} className="clickable" onClick={() => navigate(`/patients/${p.id}`)}>
                    <td><span className="code">{p.code}</span></td>
                    <td>{p.prenom} {p.nom}</td>
                    <td>{p.sexe === "F" ? "Féminin" : p.sexe === "M" ? "Masculin" : "—"}</td>
                    <td>{age(p.date_naissance)}</td>
                    <td>{p.telephone || "—"}</td>
                    <td>{p.groupe_sanguin ? <span className="badge blue">{p.groupe_sanguin}</span> : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
