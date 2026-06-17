import { useEffect, useState } from "react";
import { api } from "../api.js";
import { fmtDate, statusBadge } from "../utils.js";

export default function RendezVous() {
  const [list, setList] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patient_id: "", date: "", heure: "", motif: "" });
  const [error, setError] = useState("");

  function load() {
    api.get("/api/rendezvous").then(setList).catch(() => {});
  }
  useEffect(() => {
    load();
    api.get("/api/patients").then(setPatients).catch(() => {});
  }, []);

  async function changeStatut(id, statut) {
    await api.patch(`/api/rendezvous/${id}`, { statut });
    load();
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/api/rendezvous", form);
      setForm({ patient_id: "", date: "", heure: "", motif: "" });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  }
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <div className="page-head">
        <h1>Rendez-vous</h1>
        <p>Planifiez et suivez les rendez-vous des patients.</p>
      </div>

      <div className="toolbar">
        <div />
        <button className="btn" onClick={() => setShowForm((s) => !s)}>{showForm ? "Fermer" : "+ Nouveau rendez-vous"}</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="card-head"><h2>Nouveau rendez-vous</h2></div>
          <div className="card-body">
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={submit}>
              <div className="form-grid">
                <label className="field"><span>Patient *</span>
                  <select value={form.patient_id} onChange={set("patient_id")} required>
                    <option value="">— Sélectionner —</option>
                    {patients.map((p) => <option key={p.id} value={p.id}>{p.prenom} {p.nom} ({p.code})</option>)}
                  </select>
                </label>
                <label className="field"><span>Motif</span><input value={form.motif} onChange={set("motif")} /></label>
                <label className="field"><span>Date *</span><input type="date" value={form.date} onChange={set("date")} required /></label>
                <label className="field"><span>Heure</span><input type="time" value={form.heure} onChange={set("heure")} /></label>
              </div>
              <div className="form-actions">
                <button className="btn">Planifier</button>
                <button type="button" className="btn ghost" onClick={() => { setShowForm(false); setError(""); }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {list.length === 0 ? (
            <div className="empty">Aucun rendez-vous planifié.</div>
          ) : (
            <table>
              <thead>
                <tr><th>Date</th><th>Heure</th><th>Patient</th><th>Motif</th><th>Statut</th><th>Action</th></tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id}>
                    <td>{fmtDate(r.date)}</td>
                    <td>{r.heure || "—"}</td>
                    <td>{r.prenom} {r.nom}</td>
                    <td>{r.motif || "—"}</td>
                    <td><span className={`badge ${statusBadge(r.statut)}`}>{r.statut}</span></td>
                    <td>
                      <select value={r.statut} onChange={(e) => changeStatut(r.id, e.target.value)} style={{ padding: "5px 8px", fontSize: 13 }}>
                        <option>Planifié</option>
                        <option>Honoré</option>
                        <option>Annulé</option>
                      </select>
                    </td>
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
