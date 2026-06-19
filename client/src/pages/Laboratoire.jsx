import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlaskConical, Loader, CheckCircle, AlertTriangle } from "lucide-react";
import { api } from "../api.js";
import { fmtDate } from "../utils.js";
import { useAuth } from "../auth.jsx";
import { can } from "../perms.js";
import { useToast } from "../components/Toast.jsx";

const TYPES = [
  "NFS (Numération Formule Sanguine)",
  "Glycémie à jeun",
  "Test paludisme (TDR)",
  "Créatinine sérique",
  "CRP (Protéine C-Réactive)",
  "Urinaire (ECBU)",
  "Transaminases (ALAT/ASAT)",
  "Test de grossesse (Beta-HCG)",
  "Groupage sanguin",
  "Sérologie VIH",
];
const BADGE  = { "En attente": "amber", "En cours": "blue", "Résultat disponible": "green" };
const EMPTY  = { patient_id: "", type_analyse: TYPES[0], date_demande: "" };

export default function Laboratoire() {
  const { user }  = useAuth();
  const toast     = useToast();
  const [list,      setList]     = useState([]);
  const [patients,  setPatients] = useState([]);
  const [filtre,    setFiltre]   = useState("");
  const [showForm,  setShowForm] = useState(false);
  const [form,      setForm]     = useState(EMPTY);
  const [resultat,  setResultat] = useState({ id: null, resultats: "", alerte: false });
  const [error,     setError]    = useState("");
  const navigate = useNavigate();

  function load(f = filtre) {
    const qs = f ? `?statut=${encodeURIComponent(f)}` : "";
    api.get(`/api/analyses${qs}`).then(setList).catch(() => {});
  }
  useEffect(() => {
    load();
    api.get("/api/patients").then(setPatients).catch(() => {});
  }, []);

  function onFiltre(val) { setFiltre(val); load(val); }

  async function submit(e) {
    e.preventDefault(); setError("");
    try {
      await api.post("/api/analyses", { ...form, patient_id: Number(form.patient_id) });
      setForm(EMPTY); setShowForm(false); load();
      toast("Demande d'analyse enregistrée.");
    } catch (err) { setError(err.message); toast(err.message, "error"); }
  }

  async function enregistrerResultat(e) {
    e.preventDefault();
    await api.patch(`/api/analyses/${resultat.id}`, {
      statut: "Résultat disponible",
      resultats: resultat.resultats,
      alerte: resultat.alerte ? 1 : 0,
    });
    toast(resultat.alerte ? "Résultats saisis — valeurs critiques signalées." : "Résultats saisis avec succès.", resultat.alerte ? "warning" : "success");
    setResultat({ id: null, resultats: "", alerte: false });
    load();
  }

  async function marquerEnCours(id) {
    await api.patch(`/api/analyses/${id}`, { statut: "En cours" });
    load();
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const attente    = list.filter((a) => a.statut === "En attente").length;
  const enCours    = list.filter((a) => a.statut === "En cours").length;
  const disponible = list.filter((a) => a.statut === "Résultat disponible").length;
  const alertes    = list.filter((a) => a.alerte).length;

  return (
    <div>
      <div className="page-head">
        <h1>Laboratoire</h1>
        <p>Demandes d'analyse biologique et saisie des résultats.</p>
      </div>

      {/* Stats */}
      <div className="stats" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 18 }}>
        <div className="stat">
          <div className="ico"><FlaskConical size={20} strokeWidth={1.7}/></div>
          <div className="num">{attente}</div>
          <div className="lbl">En attente</div>
        </div>
        <div className="stat">
          <div className="ico"><Loader size={20} strokeWidth={1.7}/></div>
          <div className="num">{enCours}</div>
          <div className="lbl">En cours</div>
        </div>
        <div className="stat">
          <div className="ico"><CheckCircle size={20} strokeWidth={1.7}/></div>
          <div className="num">{disponible}</div>
          <div className="lbl">Résultats disponibles</div>
        </div>
        <div className="stat gold">
          <div className="ico"><AlertTriangle size={20} strokeWidth={1.7}/></div>
          <div className="num">{alertes}</div>
          <div className="lbl">Valeurs critiques</div>
        </div>
      </div>

      <div className="toolbar">
        <div style={{ display: "flex", gap: 8 }}>
          {["", "En attente", "En cours", "Résultat disponible"].map((s) => (
            <button
              key={s}
              className={`btn sm ${filtre === s ? "" : "ghost"}`}
              onClick={() => onFiltre(s)}
            >
              {s || "Tous"}
            </button>
          ))}
        </div>
        {can(user, "laboDemande") && (
          <button className="btn" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Fermer" : "+ Nouvelle demande"}
          </button>
        )}
      </div>

      {/* Formulaire nouvelle demande */}
      {showForm && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="card-head"><h2>Nouvelle demande d'analyse</h2></div>
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
                  <span>Type d'analyse *</span>
                  <select value={form.type_analyse} onChange={set("type_analyse")}>
                    {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </label>
                <label className="field">
                  <span>Date de demande</span>
                  <input type="date" value={form.date_demande} onChange={set("date_demande")} />
                </label>
              </div>
              <div className="form-actions">
                <button className="btn">Enregistrer la demande</button>
                <button type="button" className="btn ghost" onClick={() => { setShowForm(false); setError(""); }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formulaire saisie résultats */}
      {resultat.id && (
        <div className="card" style={{ marginBottom: 18, borderColor: "var(--gold)" }}>
          <div className="card-head"><h2>Saisir les résultats</h2></div>
          <div className="card-body">
            <form onSubmit={enregistrerResultat}>
              <label className="field">
                <span>Résultats *</span>
                <textarea
                  value={resultat.resultats}
                  onChange={(e) => setResultat({ ...resultat, resultats: e.target.value })}
                  placeholder="Ex : Glycémie : 1,1 g/L — Normal. Leucocytes : 7 500/mm³."
                  required
                  style={{ minHeight: 80 }}
                />
              </label>
              <label className="field" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <input
                  type="checkbox"
                  style={{ width: "auto" }}
                  checked={resultat.alerte}
                  onChange={(e) => setResultat({ ...resultat, alerte: e.target.checked })}
                />
                <span style={{ fontWeight: 600, color: "var(--red)" }}>Valeurs critiques (alerter le médecin)</span>
              </label>
              <div className="form-actions">
                <button className="btn">Enregistrer les résultats</button>
                <button type="button" className="btn ghost" onClick={() => setResultat({ id: null, resultats: "", alerte: false })}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tableau */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {list.length === 0 ? (
            <div className="empty">Aucune analyse{filtre ? ` avec le statut « ${filtre} »` : ""}.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Type d'analyse</th>
                  <th>Date demande</th>
                  <th>Médecin</th>
                  <th>Statut</th>
                  <th>Résultats</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((a) => (
                  <tr key={a.id} style={a.alerte ? { background: "#fdf3f2" } : {}}>
                    <td
                      style={{ cursor: "pointer", color: "var(--green-dk)", fontWeight: 600 }}
                      onClick={() => navigate(`/patients/${a.patient_id}`)}
                    >
                      {a.prenom} {a.nom}
                      <span className="code" style={{ marginLeft: 6 }}>{a.code}</span>
                    </td>
                    <td>{a.type_analyse}</td>
                    <td>{fmtDate(a.date_demande)}</td>
                    <td>{a.medecin_demandeur || "—"}</td>
                    <td>
                      <span className={`badge ${BADGE[a.statut] || "blue"}`}>{a.statut}</span>
                      {!!a.alerte && <span className="badge red" style={{ marginLeft: 5 }}>⚠ Critique</span>}
                    </td>
                    <td style={{ maxWidth: 220, fontSize: 13, color: "var(--muted)" }}>
                      {a.resultats || "—"}
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {/* Démarrer : Biologiste + Admin */}
                      {a.statut === "En attente" && can(user, "laboResultats") && (
                        <button className="btn ghost sm" onClick={() => marquerEnCours(a.id)}>
                          Démarrer
                        </button>
                      )}
                      {/* Saisir résultats : Biologiste + Admin */}
                      {a.statut === "En cours" && can(user, "laboResultats") && (
                        <button
                          className="btn sm"
                          onClick={() => setResultat({ id: a.id, resultats: a.resultats || "", alerte: !!a.alerte })}
                        >
                          Saisir résultats
                        </button>
                      )}
                      {a.statut === "Résultat disponible" && can(user, "laboResultats") && (
                        <button
                          className="btn ghost sm"
                          onClick={() => setResultat({ id: a.id, resultats: a.resultats || "", alerte: !!a.alerte })}
                        >
                          Modifier
                        </button>
                      )}
                      {/* Médecin : lecture seule sur les résultats */}
                      {a.statut === "Résultat disponible" && !can(user, "laboResultats") && (
                        <span className="badge green" style={{ fontSize:11 }}>Disponible</span>
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
