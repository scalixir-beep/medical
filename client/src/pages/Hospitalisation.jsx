import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bed, CheckCircle, Building2 } from "lucide-react";
import { api } from "../api.js";
import { fmtDate } from "../utils.js";
import { useAuth } from "../auth.jsx";
import { can } from "../perms.js";
import { useToast } from "../components/Toast.jsx";
import { SkeletonTable } from "../components/Skeleton.jsx";

const SERVICES = ["Médecine Générale", "Chirurgie", "Pédiatrie", "Maternité", "Urgences", "Réanimation"];
const EMPTY    = { patient_id: "", service: SERVICES[0], lit: "", date_entree: "", motif_admission: "" };

const BADGE = { "En cours": "green", "Sorti": "blue", "Transféré": "amber" };

export default function Hospitalisation() {
  const { user } = useAuth();
  const toast    = useToast();
  const [list,     setList]     = useState([]);
  const [patients, setPatients] = useState([]);
  const [filtre,   setFiltre]   = useState("En cours");
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState(EMPTY);
  const [error,    setError]    = useState("");
  const navigate = useNavigate();

  function load(f = filtre) {
    const qs = f ? `?statut=${encodeURIComponent(f)}` : "";
    api.get(`/api/hospitalisations${qs}`).then(setList).catch(() => {});
  }
  useEffect(() => {
    load();
    api.get("/api/patients").then(setPatients).catch(() => {});
  }, []);

  function onFiltre(val) { setFiltre(val); load(val); }

  async function submit(e) {
    e.preventDefault(); setError("");
    try {
      await api.post("/api/hospitalisations", { ...form, patient_id: Number(form.patient_id) });
      setForm(EMPTY); setShowForm(false); load();
      toast("Admission enregistrée.");
    } catch (err) { setError(err.message); toast(err.message, "error"); }
  }

  async function sortir(h) {
    const diagSortie = prompt("Diagnostic / motif de sortie :", "");
    if (diagSortie === null) return;
    await api.patch(`/api/hospitalisations/${h.id}`, {
      statut: "Sorti",
      date_sortie: new Date().toISOString().slice(0, 10),
      diagnostic_sortie: diagSortie,
    });
    toast(`Sortie de ${h.prenom} ${h.nom} enregistrée.`, "info");
    load();
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const enCours = list.filter((h) => h.statut === "En cours").length;
  const sortis  = list.filter((h) => h.statut === "Sorti").length;

  return (
    <div>
      <div className="page-head">
        <h1>Hospitalisation</h1>
        <p>Suivi des admissions et séjours hospitaliers.</p>
      </div>

      {/* Stats rapides */}
      <div className="stats" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: 18 }}>
        <div className="stat">
          <div className="ico"><Bed size={20} strokeWidth={1.7}/></div>
          <div className="num">{enCours}</div>
          <div className="lbl">Patients hospitalisés</div>
        </div>
        <div className="stat gold">
          <div className="ico"><CheckCircle size={20} strokeWidth={1.7}/></div>
          <div className="num">{sortis}</div>
          <div className="lbl">Sorties (filtre actif)</div>
        </div>
        <div className="stat">
          <div className="ico"><Building2 size={20} strokeWidth={1.7}/></div>
          <div className="num">{SERVICES.length}</div>
          <div className="lbl">Services disponibles</div>
        </div>
      </div>

      <div className="toolbar">
        {/* Filtres statut */}
        <div style={{ display: "flex", gap: 8 }}>
          {["En cours", "Sorti", ""].map((s) => (
            <button
              key={s}
              className={`btn sm ${filtre === s ? "" : "ghost"}`}
              onClick={() => onFiltre(s)}
            >
              {s || "Tous"}
            </button>
          ))}
        </div>
        {/* Admettre un patient : Médecin + Admin seulement */}
        {can(user, "hospitalisationCreate") && (
          <button className="btn" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Fermer" : "+ Nouvelle admission"}
          </button>
        )}
      </div>

      {/* Formulaire d'admission */}
      {showForm && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="card-head"><h2>Nouvelle admission</h2></div>
          <div className="card-body">
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={submit}>
              <div className="form-grid">
                <label className="field">
                  <span>Patient *</span>
                  <select value={form.patient_id} onChange={set("patient_id")} required>
                    <option value="">— Sélectionner —</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>{p.prenom} {p.nom} ({p.code})</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Service *</span>
                  <select value={form.service} onChange={set("service")}>
                    {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
                <label className="field">
                  <span>Numéro de lit</span>
                  <input value={form.lit} onChange={set("lit")} placeholder="Ex : 101-A" />
                </label>
                <label className="field">
                  <span>Date d'entrée</span>
                  <input type="date" value={form.date_entree} onChange={set("date_entree")} />
                </label>
              </div>
              <label className="field">
                <span>Motif d'admission</span>
                <input value={form.motif_admission} onChange={set("motif_admission")} placeholder="Ex : Paludisme grave, douleurs abdominales…" />
              </label>
              <div className="form-actions">
                <button className="btn">Enregistrer l'admission</button>
                <button type="button" className="btn ghost" onClick={() => { setShowForm(false); setError(""); }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tableau */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {list.length === 0 ? (
            <div className="empty">Aucune hospitalisation{filtre ? ` avec le statut « ${filtre} »` : ""}.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Service</th>
                  <th>Lit</th>
                  <th>Entrée</th>
                  <th>Sortie</th>
                  <th>Motif</th>
                  <th>Statut</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {list.map((h) => (
                  <tr key={h.id}>
                    <td
                      className="clickable"
                      style={{ cursor: "pointer", color: "var(--green-dk)", fontWeight: 600 }}
                      onClick={() => navigate(`/patients/${h.patient_id}`)}
                    >
                      {h.prenom} {h.nom}
                      <span className="code" style={{ marginLeft: 6 }}>{h.code}</span>
                    </td>
                    <td>{h.service}</td>
                    <td>{h.lit || "—"}</td>
                    <td>{fmtDate(h.date_entree)}</td>
                    <td>{h.date_sortie ? fmtDate(h.date_sortie) : <span style={{ color: "var(--muted)" }}>En séjour</span>}</td>
                    <td>{h.motif_admission || "—"}</td>
                    <td><span className={`badge ${BADGE[h.statut] || "blue"}`}>{h.statut}</span></td>
                    <td>
                      {/* Sortir un patient : Médecin + Admin seulement */}
                      {h.statut === "En cours" && can(user, "hospitalisationCreate") && (
                        <button className="btn ghost sm" onClick={() => sortir(h)}>Sortie</button>
                      )}
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
