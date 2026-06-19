import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "../api.js";
import { fmtDate, statusBadge } from "../utils.js";
import { useToast } from "../components/Toast.jsx";

const JOURS  = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const MOIS   = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const STATUTS = ["Planifié","Honoré","Annulé"];

/* ─── Composant Calendrier ─── */
function CalendrierRdv({ rdvList }) {
  const [cur, setCur] = useState(() => {
    const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() };
  });
  const [selected, setSelected] = useState(null);
  const { y, m } = cur;
  const firstDay = (new Date(y, m, 1).getDay() + 6) % 7;
  const nbDays   = new Date(y, m + 1, 0).getDate();
  const todayISO = new Date().toISOString().slice(0, 10);

  const byDate = {};
  rdvList.forEach(r => {
    if (!byDate[r.date]) byDate[r.date] = [];
    byDate[r.date].push(r);
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= nbDays; d++) cells.push(d);

  function dayISO(d) {
    return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  }
  const selList = selected ? (byDate[selected] || []) : [];

  return (
    <div className="cal-wrap">
      <div className="cal-nav">
        <button className="btn ghost sm" onClick={() => setCur(p => {
          const d = new Date(p.y, p.m - 1); return { y:d.getFullYear(), m:d.getMonth() };
        })}><ChevronLeft size={16}/></button>
        <span className="cal-month">{MOIS[m]} {y}</span>
        <button className="btn ghost sm" onClick={() => setCur(p => {
          const d = new Date(p.y, p.m + 1); return { y:d.getFullYear(), m:d.getMonth() };
        })}><ChevronRight size={16}/></button>
      </div>

      <div className="cal-grid">
        {JOURS.map(j => <div key={j} className="cal-head-cell">{j}</div>)}
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} className="cal-cell cal-empty"/>;
          const iso  = dayISO(d);
          const rdvs = byDate[iso] || [];
          const isToday = iso === todayISO;
          const isSel   = iso === selected;
          return (
            <div
              key={iso}
              className={`cal-cell${isToday?" cal-today":""}${isSel?" cal-sel":""}${rdvs.length?" cal-has-rdv":""}`}
              onClick={() => setSelected(isSel ? null : iso)}
            >
              <span className="cal-day-num">{d}</span>
              {rdvs.length > 0 && (
                <div className="cal-dots">
                  {rdvs.slice(0,3).map((r,i) => (
                    <span key={i} className={`cal-dot cal-dot-${r.statut==="Honoré"?"green":r.statut==="Annulé"?"red":"blue"}`}/>
                  ))}
                  {rdvs.length > 3 && <span className="cal-dot-more">+{rdvs.length-3}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="cal-detail">
          <div className="cal-detail-title">
            {selected.split("-").reverse().join("/")} — {selList.length} rendez-vous
          </div>
          {selList.length === 0
            ? <div className="empty" style={{ padding:"10px 0" }}>Aucun RDV ce jour.</div>
            : selList.map(r => (
              <div key={r.id} className="cal-rdv-item">
                <span className="cal-rdv-heure">{r.heure || "—"}</span>
                <div style={{ flex:1 }}>
                  <span style={{ fontWeight:600 }}>{r.prenom} {r.nom}</span>
                  <span className="code" style={{ marginLeft:6 }}>{r.code}</span>
                  {r.motif && <div style={{ fontSize:12, color:"var(--muted)" }}>{r.motif}</div>}
                </div>
                <span className={`badge ${statusBadge(r.statut)}`}>{r.statut}</span>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

/* ─── Page principale ─── */
export default function RendezVous() {
  const toast      = useToast();
  const [list,     setList]     = useState([]);
  const [patients, setPatients] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [filtre,   setFiltre]   = useState("Planifié");
  const [vue,      setVue]      = useState("liste");
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState({ patient_id:"", date:"", heure:"", medecin:"", motif:"" });
  const [error,    setError]    = useState("");

  function load() { api.get("/api/rendezvous").then(setList).catch(() => {}); }

  useEffect(() => {
    load();
    api.get("/api/patients").then(d => setPatients(Array.isArray(d) ? d : (d.data || []))).catch(() => {});
    api.get("/api/medecins").then(setMedecins).catch(() => {});
  }, []);

  const filtered = filtre ? list.filter(r => r.statut === filtre) : list;

  async function submit(e) {
    e.preventDefault(); setError("");
    try {
      await api.post("/api/rendezvous", { ...form, patient_id: Number(form.patient_id) });
      setForm({ patient_id:"", date:"", heure:"", medecin:"", motif:"" });
      setShowForm(false); load();
      toast("Rendez-vous planifié.");
    } catch (err) { setError(err.message); toast(err.message, "error"); }
  }

  async function changeStatut(id, statut) {
    await api.patch(`/api/rendezvous/${id}`, { statut });
    toast(statut === "Honoré" ? "RDV marqué comme Honoré." : "RDV annulé.", statut === "Annulé" ? "warning" : "success");
    load();
  }

  const set = k => e => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <div className="page-head">
        <h1>Rendez-vous</h1>
        <p>Planning et gestion des rendez-vous patients.</p>
      </div>

      <div className="toolbar">
        <div style={{ display:"flex", gap:6 }}>
          {["", ...STATUTS].map(s => (
            <button key={s} className={`btn sm ${filtre===s?"":"ghost"}`} onClick={() => setFiltre(s)}>
              {s || "Tous"}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <div className="vue-toggle">
            <button className={`vue-btn${vue==="liste"?" active":""}`} onClick={() => setVue("liste")}>Liste</button>
            <button className={`vue-btn${vue==="calendrier"?" active":""}`} onClick={() => setVue("calendrier")}>Calendrier</button>
          </div>
          <button className="btn" onClick={() => { setShowForm(v => !v); setError(""); }}>
            {showForm ? "Fermer" : "+ Nouveau RDV"}
          </button>
        </div>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="card" style={{ marginBottom:18 }}>
          <div className="card-head"><h2>Nouveau rendez-vous</h2></div>
          <div className="card-body">
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={submit}>
              <div className="form-grid">
                <label className="field">
                  <span>Patient *</span>
                  <select value={form.patient_id} onChange={set("patient_id")} required>
                    <option value="">— Sélectionner —</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.prenom} {p.nom} ({p.code})</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Médecin *</span>
                  <select value={form.medecin} onChange={set("medecin")} required>
                    <option value="">— Sélectionner —</option>
                    {medecins.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Date *</span>
                  <input type="date" value={form.date} onChange={set("date")} required/>
                </label>
                <label className="field">
                  <span>Heure</span>
                  <input type="time" value={form.heure} onChange={set("heure")}/>
                </label>
              </div>
              <label className="field">
                <span>Motif</span>
                <input value={form.motif} onChange={set("motif")} placeholder="Consultation générale, suivi…"/>
              </label>
              <div className="form-actions">
                <button className="btn">Planifier le rendez-vous</button>
                <button type="button" className="btn ghost" onClick={() => { setShowForm(false); setError(""); }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Calendrier */}
      {vue === "calendrier" && (
        <div className="card" style={{ marginBottom:18 }}>
          <div className="card-body">
            <CalendrierRdv rdvList={list}/>
          </div>
        </div>
      )}

      {/* Liste */}
      {vue === "liste" && (
        <div className="card">
          <div className="card-body" style={{ padding:0 }}>
            {filtered.length === 0
              ? <div className="empty">Aucun rendez-vous{filtre ? ` « ${filtre} »` : ""}.</div>
              : (
                <table>
                  <thead>
                    <tr><th>Date</th><th>Heure</th><th>Patient</th><th>Médecin</th><th>Motif</th><th>Statut</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map(r => (
                      <tr key={r.id}>
                        <td style={{ whiteSpace:"nowrap" }}>{fmtDate(r.date)}</td>
                        <td style={{ fontWeight:600 }}>{r.heure || "—"}</td>
                        <td>
                          <span style={{ fontWeight:600 }}>{r.prenom} {r.nom}</span>
                          <span className="code" style={{ marginLeft:6 }}>{r.code}</span>
                        </td>
                        <td style={{ fontSize:13, color:"var(--muted)" }}>{r.medecin || "—"}</td>
                        <td>{r.motif || "—"}</td>
                        <td><span className={`badge ${statusBadge(r.statut)}`}>{r.statut}</span></td>
                        <td style={{ whiteSpace:"nowrap" }}>
                          {r.statut === "Planifié" && (<>
                            <button className="btn ghost sm" style={{ marginRight:4 }} onClick={() => changeStatut(r.id,"Honoré")}>Honoré</button>
                            <button className="btn danger sm" onClick={() => changeStatut(r.id,"Annulé")}>Annuler</button>
                          </>)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            }
          </div>
        </div>
      )}
    </div>
  );
}
