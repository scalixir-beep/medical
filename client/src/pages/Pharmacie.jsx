import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Clock, Pill, AlertTriangle } from "lucide-react";
import { api } from "../api.js";
import { fmtDate } from "../utils.js";
import { useAuth } from "../auth.jsx";
import { can } from "../perms.js";
import { useToast } from "../components/Toast.jsx";

const ORDO_BADGE = { "En attente": "amber", "Dispensée": "green", "Partielle": "blue" };
const EMPTY_ORDO = { patient_id: "", date: "" };
const EMPTY_LINE = { nom: "", dose: "", duree: "", instructions: "" };

function StockBar({ stock, seuil }) {
  const pct   = Math.min(100, Math.round((stock / Math.max(seuil * 3, 1)) * 100));
  const color = stock === 0 ? "var(--red)" : stock <= seuil ? "var(--amber)" : "var(--ok)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 64, height: 6, borderRadius: 3, background: "var(--border)", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3 }}/>
      </div>
      <span style={{ fontWeight: 700, color, fontSize: 13 }}>
        {stock === 0 ? "Rupture" : stock <= seuil ? "Stock bas" : stock}
      </span>
    </div>
  );
}

export default function Pharmacie() {
  const { user } = useAuth();
  const toast    = useToast();
  const [tab,       setTab]      = useState(
    // Pharmacien commence sur "stock", Médecin sur "ordonnances"
    "ordonnances"
  );
  const [ordos,     setOrdos]    = useState([]);
  const [meds,      setMeds]     = useState([]);
  const [patients,  setPatients] = useState([]);
  const [showForm,  setShowForm] = useState(false);
  const [form,      setForm]     = useState(EMPTY_ORDO);
  const [lignes,    setLignes]   = useState([{ ...EMPTY_LINE }]);
  const [editStock, setEditStock]= useState(null);
  const [error,     setError]    = useState("");
  const navigate = useNavigate();

  function loadOrdos() { api.get("/api/ordonnances").then(setOrdos).catch(() => {}); }
  function loadMeds()  { api.get("/api/medicaments").then(setMeds).catch(() => {}); }

  useEffect(() => {
    loadOrdos(); loadMeds();
    api.get("/api/patients").then(setPatients).catch(() => {});
  }, []);

  /* Ajouter / supprimer une ligne d'ordonnance */
  function setLigne(i, k, v) {
    const next = [...lignes];
    next[i] = { ...next[i], [k]: v };
    setLignes(next);
  }
  function addLigne()    { setLignes([...lignes, { ...EMPTY_LINE }]); }
  function removeLigne(i){ setLignes(lignes.filter((_, idx) => idx !== i)); }

  async function submitOrdo(e) {
    e.preventDefault(); setError("");
    const valides = lignes.filter((l) => l.nom.trim());
    if (!valides.length) { setError("Ajoutez au moins un médicament."); return; }
    try {
      await api.post("/api/ordonnances", {
        ...form,
        patient_id:  Number(form.patient_id),
        medicaments: valides,
      });
      setForm(EMPTY_ORDO); setLignes([{ ...EMPTY_LINE }]); setShowForm(false); loadOrdos();
      toast("Ordonnance créée avec succès.");
    } catch (err) { setError(err.message); toast(err.message, "error"); }
  }

  async function changeStatut(id, statut) {
    await api.patch(`/api/ordonnances/${id}`, { statut });
    toast(statut === "Dispensée" ? "Ordonnance dispensée." : "Statut mis à jour.", "info");
    loadOrdos();
  }

  async function saveStock(id, stock) {
    await api.patch(`/api/medicaments/${id}`, { stock: Number(stock) });
    setEditStock(null); loadMeds();
  }

  const alerteCount = meds.filter((m) => m.stock <= m.seuil_alerte).length;
  const enAttenteCount = ordos.filter((o) => o.statut === "En attente").length;

  return (
    <div>
      <div className="page-head">
        <h1>Pharmacie</h1>
        <p>Gestion des ordonnances et du stock de médicaments.</p>
      </div>

      {/* Stats */}
      <div className="stats" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 18 }}>
        <div className="stat">
          <div className="ico"><ClipboardList size={20} strokeWidth={1.7}/></div>
          <div className="num">{ordos.length}</div>
          <div className="lbl">Ordonnances total</div>
        </div>
        <div className="stat gold">
          <div className="ico"><Clock size={20} strokeWidth={1.7}/></div>
          <div className="num">{enAttenteCount}</div>
          <div className="lbl">En attente de dispensation</div>
        </div>
        <div className="stat">
          <div className="ico"><Pill size={20} strokeWidth={1.7}/></div>
          <div className="num">{meds.length}</div>
          <div className="lbl">Médicaments en stock</div>
        </div>
        <div className="stat">
          <div className="ico"><AlertTriangle size={20} strokeWidth={1.7}/></div>
          <div className="num" style={{ color: alerteCount ? "var(--red)" : "inherit" }}>{alerteCount}</div>
          <div className="lbl">Alertes rupture / stock bas</div>
        </div>
      </div>

      {/* Tabs — visibles selon le rôle */}
      <div className="tabs">
        <button className={`tab-btn${tab === "ordonnances" ? " active" : ""}`} onClick={() => setTab("ordonnances")}>
          Ordonnances
        </button>
        {can(user, "pharmacieStock") && (
          <button className={`tab-btn${tab === "stock" ? " active" : ""}`} onClick={() => setTab("stock")}>
            Stock médicaments {alerteCount > 0 && <span className="badge red" style={{ marginLeft: 6 }}>{alerteCount}</span>}
          </button>
        )}
      </div>

      {/* ─── Onglet Ordonnances ─── */}
      {tab === "ordonnances" && (
        <>
          <div className="toolbar" style={{ marginBottom: 18 }}>
            <div/>
            {/* Créer une ordonnance : Médecin + Admin seulement */}
            {can(user, "pharmacieOrdonnance") && (
              <button className="btn" onClick={() => setShowForm((v) => !v)}>
                {showForm ? "Fermer" : "+ Nouvelle ordonnance"}
              </button>
            )}
          </div>

          {showForm && (
            <div className="card" style={{ marginBottom: 18 }}>
              <div className="card-head"><h2>Nouvelle ordonnance</h2></div>
              <div className="card-body">
                {error && <div className="error-msg">{error}</div>}
                <form onSubmit={submitOrdo}>
                  <div className="form-grid">
                    <label className="field">
                      <span>Patient *</span>
                      <select value={form.patient_id} onChange={(e) => setForm({ ...form, patient_id: e.target.value })} required>
                        <option value="">— Sélectionner —</option>
                        {patients.map((p) => (
                          <option key={p.id} value={p.id}>{p.prenom} {p.nom} ({p.code})</option>
                        ))}
                      </select>
                    </label>
                    <label className="field">
                      <span>Date</span>
                      <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                    </label>
                  </div>

                  {/* Lignes médicaments */}
                  <div style={{ marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#3f5246" }}>Médicaments prescrits</span>
                    {lignes.map((l, i) => (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr auto", gap: 8, marginTop: 8, alignItems: "end" }}>
                        <label className="field" style={{ margin: 0 }}>
                          {i === 0 && <span>Médicament *</span>}
                          <input value={l.nom} onChange={(e) => setLigne(i, "nom", e.target.value)} placeholder="Ex : Paracétamol 500 mg" />
                        </label>
                        <label className="field" style={{ margin: 0 }}>
                          {i === 0 && <span>Dose</span>}
                          <input value={l.dose} onChange={(e) => setLigne(i, "dose", e.target.value)} placeholder="Ex : 1 cp" />
                        </label>
                        <label className="field" style={{ margin: 0 }}>
                          {i === 0 && <span>Durée</span>}
                          <input value={l.duree} onChange={(e) => setLigne(i, "duree", e.target.value)} placeholder="Ex : 5 jours" />
                        </label>
                        <label className="field" style={{ margin: 0 }}>
                          {i === 0 && <span>Instructions</span>}
                          <input value={l.instructions} onChange={(e) => setLigne(i, "instructions", e.target.value)} placeholder="Ex : 3x/jour après repas" />
                        </label>
                        <button type="button" className="btn danger sm" style={{ marginBottom: 0 }} onClick={() => removeLigne(i)}>✕</button>
                      </div>
                    ))}
                    <button type="button" className="btn ghost sm" style={{ marginTop: 10 }} onClick={addLigne}>
                      + Ajouter un médicament
                    </button>
                  </div>

                  <div className="form-actions">
                    <button className="btn">Enregistrer l'ordonnance</button>
                    <button type="button" className="btn ghost" onClick={() => { setShowForm(false); setError(""); setLignes([{ ...EMPTY_LINE }]); }}>Annuler</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-body" style={{ padding: 0 }}>
              {ordos.length === 0 ? (
                <div className="empty">Aucune ordonnance enregistrée.</div>
              ) : (
                <table>
                  <thead>
                    <tr><th>Patient</th><th>Date</th><th>Médecin</th><th>Médicaments</th><th>Statut</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {ordos.map((o) => {
                      let meds_list = [];
                      try { meds_list = JSON.parse(o.medicaments_json || "[]"); } catch { }
                      return (
                        <tr key={o.id}>
                          <td
                            style={{ cursor: "pointer", color: "var(--green-dk)", fontWeight: 600 }}
                            onClick={() => navigate(`/patients/${o.patient_id}`)}
                          >
                            {o.prenom} {o.nom}
                            <span className="code" style={{ marginLeft: 6 }}>{o.code}</span>
                          </td>
                          <td>{fmtDate(o.date)}</td>
                          <td>{o.medecin || "—"}</td>
                          <td style={{ fontSize: 13 }}>
                            {meds_list.length === 0 ? "—" : meds_list.map((m, i) => (
                              <div key={i} style={{ lineHeight: 1.5 }}>
                                <b>{m.nom}</b>{m.dose ? ` — ${m.dose}` : ""}{m.duree ? `, ${m.duree}` : ""}
                              </div>
                            ))}
                          </td>
                          <td><span className={`badge ${ORDO_BADGE[o.statut] || "blue"}`}>{o.statut}</span></td>
                          <td>
                            {/* Dispenser : Pharmacien + Admin seulement */}
                            {o.statut === "En attente" && can(user, "pharmacieDispenser") && (
                              <button className="btn sm" onClick={() => changeStatut(o.id, "Dispensée")}>Dispenser</button>
                            )}
                            {o.statut === "En attente" && !can(user, "pharmacieDispenser") && (
                              <span style={{ fontSize:11, color:"var(--amber)", fontWeight:600 }}>En attente pharmacie</span>
                            )}
                            {o.statut === "Dispensée" && (
                              <span style={{ fontSize: 12, color: "var(--muted)" }}>✓ Dispensée</span>
                            )}
                            {o.statut === "Partielle" && can(user, "pharmacieDispenser") && (
                              <button className="btn ghost sm" onClick={() => changeStatut(o.id, "Dispensée")}>Compléter</button>
                            )}
                            <a
                              href={`/ordonnances/${o.id}/imprimer`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn ghost sm"
                              style={{ marginLeft: 4 }}
                            >
                              🖨
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}

      {/* ─── Onglet Stock ─── */}
      {tab === "stock" && (
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            <table>
              <thead>
                <tr><th>Médicament</th><th>Forme</th><th>Stock actuel</th><th>Seuil alerte</th><th>Unité</th><th></th></tr>
              </thead>
              <tbody>
                {meds.map((m) => (
                  <tr key={m.id} style={m.stock <= m.seuil_alerte ? { background: m.stock === 0 ? "#fdf3f2" : "#fdf8ec" } : {}}>
                    <td style={{ fontWeight: 600 }}>{m.nom}</td>
                    <td>{m.forme || "—"}</td>
                    <td>
                      {editStock === m.id ? (
                        <form
                          onSubmit={(e) => { e.preventDefault(); saveStock(m.id, e.target.stock.value); }}
                          style={{ display: "flex", gap: 6, alignItems: "center" }}
                        >
                          <input name="stock" type="number" min="0" defaultValue={m.stock}
                            style={{ width: 80, padding: "4px 8px" }} autoFocus />
                          <button className="btn sm">OK</button>
                          <button type="button" className="btn ghost sm" onClick={() => setEditStock(null)}>✕</button>
                        </form>
                      ) : (
                        <StockBar stock={m.stock} seuil={m.seuil_alerte} />
                      )}
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: 13 }}>{m.seuil_alerte}</td>
                    <td style={{ color: "var(--muted)", fontSize: 13 }}>{m.unite}</td>
                    <td>
                      <button className="btn ghost sm" onClick={() => setEditStock(m.id)}>
                        Modifier stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
