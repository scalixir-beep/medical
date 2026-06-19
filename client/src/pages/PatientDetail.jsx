import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api.js";
import { fmtDate, age, statusBadge, hospBadge, analyseBadge, ordoBadge } from "../utils.js";
import { useAuth } from "../auth.jsx";
import { can } from "../perms.js";
import { useToast } from "../components/Toast.jsx";
import { SkeletonInfoCard, SkeletonTimeline } from "../components/Skeleton.jsx";

const EMPTY_CONS = {
  motif: "", diagnostic: "", traitement: "",
  tension: "", temperature: "", poids: "", taille: "", fc: "",
};
const EMPTY_RDV = { date: "", heure: "", motif: "" };

export default function PatientDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast    = useToast();

  const [patient,  setPatient]  = useState(null);
  const [cons,     setCons]     = useState({ ...EMPTY_CONS });
  const [rdv,      setRdv]      = useState({ ...EMPTY_RDV });
  const [showCons, setShowCons] = useState(false);
  const [showRdv,  setShowRdv]  = useState(false);
  const [consErr,  setConsErr]  = useState("");
  const [rdvErr,   setRdvErr]   = useState("");

  function load() {
    api.get(`/api/patients/${id}`).then(setPatient).catch(() => setPatient(false));
  }
  useEffect(() => { load(); }, [id]);

  if (patient === false) return <div className="empty">Patient introuvable.</div>;
  if (!patient) return (
    <div>
      <SkeletonInfoCard/>
      <div className="grid-2">
        <div className="card"><div className="card-head"><div className="sk" style={{ width:140, height:16, borderRadius:5 }}/></div><div className="card-body"><SkeletonTimeline items={3}/></div></div>
        <div className="card"><div className="card-head"><div className="sk" style={{ width:100, height:16, borderRadius:5 }}/></div><div className="card-body"><SkeletonTimeline items={2}/></div></div>
      </div>
    </div>
  );

  async function addCons(e) {
    e.preventDefault(); setConsErr("");
    try {
      await api.post("/api/consultations", { patient_id: patient.id, ...cons });
      setCons({ ...EMPTY_CONS }); setShowCons(false); load();
      toast("Consultation enregistrée.");
    } catch (err) { setConsErr(err.message); toast(err.message, "error"); }
  }

  async function addRdv(e) {
    e.preventDefault(); setRdvErr("");
    try {
      await api.post("/api/rendezvous", { patient_id: patient.id, ...rdv });
      setRdv({ ...EMPTY_RDV }); setShowRdv(false); load();
      toast("Rendez-vous planifié.");
    } catch (err) { setRdvErr(err.message); toast(err.message, "error"); }
  }

  async function archive() {
    if (!confirm(`Archiver le dossier de ${patient.prenom} ${patient.nom} ?`)) return;
    await api.patch(`/api/patients/${patient.id}/archive`);
    toast(`Dossier de ${patient.prenom} ${patient.nom} archivé.`, "warning");
    navigate("/patients");
  }

  const setC = (k) => (e) => setCons({ ...cons, [k]: e.target.value });
  const setR = (k) => (e) => setRdv({  ...rdv,  [k]: e.target.value });

  const hospit   = patient.hospitalisations || [];
  const analyses = patient.analyses         || [];
  const ordos    = patient.ordonnances      || [];

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <Link className="back-link" style={{ margin:0 }} to="/patients">← Retour aux patients</Link>
        <a
          href={`/patients/${patient.id}/imprimer`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn ghost sm"
        >
          🖨 Imprimer le dossier
        </a>
      </div>

      {/* ── Informations patient ── */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-head">
          <div>
            <h2 style={{ marginBottom: 2 }}>
              {patient.prenom} {patient.nom}
              <span className="code" style={{ marginLeft: 10 }}>{patient.code}</span>
            </h2>
            {patient.archived === 1 && (
              <span className="badge amber" style={{ fontSize: 11 }}>Dossier archivé</span>
            )}
          </div>
          {can(user, "patientDelete") && patient.archived !== 1 && (
            <button className="btn ghost sm" style={{ color:"var(--amber)", borderColor:"var(--amber-bg)" }} onClick={archive}>
              Archiver le dossier
            </button>
          )}
        </div>
        <div className="card-body">
          <div className="info-grid">
            <div><div className="k">Sexe</div><div className="v">{patient.sexe === "F" ? "Féminin" : patient.sexe === "M" ? "Masculin" : "—"}</div></div>
            <div><div className="k">Date de naissance</div><div className="v">{fmtDate(patient.date_naissance)} ({age(patient.date_naissance)})</div></div>
            <div><div className="k">Téléphone</div><div className="v">{patient.telephone || "—"}</div></div>
            <div><div className="k">Groupe sanguin</div><div className="v">{patient.groupe_sanguin || "—"}</div></div>
            <div><div className="k">Adresse</div><div className="v">{patient.adresse || "—"}</div></div>
            <div><div className="k">Dossier créé le</div><div className="v">{fmtDate(patient.created_at)}</div></div>
          </div>
        </div>
      </div>

      {/* ── Consultations + RDV ── */}
      <div className="grid-2" style={{ marginBottom: 18 }}>

        {/* Consultations */}
        <div className="card">
          <div className="card-head">
            <h2>Consultations</h2>
            {can(user, "consultationCreate") && (
              <button className="btn ghost sm" onClick={() => { setShowCons(s => !s); setConsErr(""); }}>
                {showCons ? "Fermer" : "+ Ajouter"}
              </button>
            )}
          </div>
          <div className="card-body">
            {!can(user, "consultations") ? (
              <div className="notice">Réservé au personnel médical.</div>
            ) : (<>
              {showCons && (
                <form onSubmit={addCons} style={{ marginBottom:16, paddingBottom:16, borderBottom:"1px solid var(--border)" }}>
                  {consErr && <div className="error-msg">{consErr}</div>}

                  <label className="field"><span>Motif *</span>
                    <input value={cons.motif} onChange={setC("motif")} required/>
                  </label>
                  <label className="field"><span>Diagnostic</span>
                    <input value={cons.diagnostic} onChange={setC("diagnostic")}/>
                  </label>
                  <label className="field"><span>Traitement / Prescription</span>
                    <textarea value={cons.traitement} onChange={setC("traitement")}/>
                  </label>

                  {/* Constantes vitales */}
                  <p style={{ fontSize:12, fontWeight:700, color:"#3f5246", margin:"4px 0 10px", textTransform:"uppercase", letterSpacing:".5px" }}>
                    Constantes vitales
                  </p>
                  <div className="form-grid">
                    <label className="field">
                      <span>Tension artérielle</span>
                      <input value={cons.tension} onChange={setC("tension")} placeholder="ex : 120/80"/>
                    </label>
                    <label className="field">
                      <span>Température (°C)</span>
                      <input value={cons.temperature} onChange={setC("temperature")} placeholder="ex : 37.5"/>
                    </label>
                    <label className="field">
                      <span>Poids (kg)</span>
                      <input value={cons.poids} onChange={setC("poids")} placeholder="ex : 70"/>
                    </label>
                    <label className="field">
                      <span>Taille (cm)</span>
                      <input value={cons.taille} onChange={setC("taille")} placeholder="ex : 175"/>
                    </label>
                    <label className="field">
                      <span>Fréquence cardiaque (bpm)</span>
                      <input value={cons.fc} onChange={setC("fc")} placeholder="ex : 75"/>
                    </label>
                  </div>

                  <button className="btn sm">Enregistrer la consultation</button>
                </form>
              )}

              {patient.consultations.length === 0
                ? <div className="empty">Aucune consultation.</div>
                : patient.consultations.map(c => (
                  <div className="timeline-item" key={c.id}>
                    <div className="meta">{fmtDate(c.date)} · {c.medecin}</div>
                    <div className="motif">{c.motif}</div>
                    {/* Constantes vitales */}
                    {(c.tension || c.temperature || c.poids || c.taille || c.fc) && (
                      <div className="vitals-row">
                        {c.tension     && <span className="vital-chip">TA {c.tension} <em>mmHg</em></span>}
                        {c.temperature && <span className="vital-chip">T° {c.temperature}<em>°C</em></span>}
                        {c.poids       && <span className="vital-chip">Poids {c.poids} <em>kg</em></span>}
                        {c.taille      && <span className="vital-chip">Taille {c.taille} <em>cm</em></span>}
                        {c.fc          && <span className="vital-chip">FC {c.fc} <em>bpm</em></span>}
                      </div>
                    )}
                    {c.diagnostic && <div className="dx"><b>Diagnostic :</b> {c.diagnostic}</div>}
                    {c.traitement && <div className="dx"><b>Traitement :</b> {c.traitement}</div>}
                  </div>
                ))
              }
            </>)}
          </div>
        </div>

        {/* Rendez-vous */}
        <div className="card">
          <div className="card-head">
            <h2>Rendez-vous</h2>
            <button className="btn ghost sm" onClick={() => { setShowRdv(s => !s); setRdvErr(""); }}>
              {showRdv ? "Fermer" : "+ Ajouter"}
            </button>
          </div>
          <div className="card-body">
            {showRdv && (
              <form onSubmit={addRdv} style={{ marginBottom:16, paddingBottom:16, borderBottom:"1px solid var(--border)" }}>
                {rdvErr && <div className="error-msg">{rdvErr}</div>}
                <div className="form-grid">
                  <label className="field"><span>Date *</span>
                    <input type="date" value={rdv.date} onChange={setR("date")} required/>
                  </label>
                  <label className="field"><span>Heure</span>
                    <input type="time" value={rdv.heure} onChange={setR("heure")}/>
                  </label>
                </div>
                <label className="field"><span>Motif</span>
                  <input value={rdv.motif} onChange={setR("motif")}/>
                </label>
                <button className="btn sm">Planifier</button>
              </form>
            )}
            {patient.rendezvous.length === 0
              ? <div className="empty">Aucun rendez-vous.</div>
              : patient.rendezvous.map(r => (
                <div className="timeline-item" key={r.id}>
                  <div className="meta">{fmtDate(r.date)}{r.heure ? ` · ${r.heure}` : ""}</div>
                  <div className="motif">
                    {r.motif || "Rendez-vous"}{" "}
                    <span className={`badge ${statusBadge(r.statut)}`} style={{ marginLeft:6 }}>{r.statut}</span>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* ── Hospitalisations ── */}
      {can(user, "hospitalisation") && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="card-head"><h2>Hospitalisations</h2></div>
          <div className="card-body" style={{ padding:0 }}>
            {hospit.length === 0
              ? <div className="empty">Aucune hospitalisation.</div>
              : <table>
                  <thead>
                    <tr><th>Service</th><th>Lit</th><th>Entrée</th><th>Sortie</th><th>Motif</th><th>Statut</th></tr>
                  </thead>
                  <tbody>
                    {hospit.map(h => (
                      <tr key={h.id}>
                        <td>{h.service}</td>
                        <td>{h.lit || "—"}</td>
                        <td>{fmtDate(h.date_entree)}</td>
                        <td>{h.date_sortie ? fmtDate(h.date_sortie) : <span style={{ color:"var(--muted)" }}>En séjour</span>}</td>
                        <td>{h.motif_admission || "—"}</td>
                        <td><span className={`badge ${hospBadge(h.statut)}`}>{h.statut}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
          </div>
        </div>
      )}

      {/* ── Analyses + Ordonnances ── */}
      {can(user, "laboratoire") && (
        <div className="grid-2">
          <div className="card">
            <div className="card-head"><h2>Analyses biologiques</h2></div>
            <div className="card-body">
              {analyses.length === 0
                ? <div className="empty">Aucune analyse demandée.</div>
                : analyses.map(a => (
                  <div className="timeline-item" key={a.id}>
                    <div className="meta">{fmtDate(a.date_demande)} · {a.medecin_demandeur}</div>
                    <div className="motif">
                      {a.type_analyse}{" "}
                      <span className={`badge ${analyseBadge(a.statut)}`} style={{ marginLeft:6 }}>{a.statut}</span>
                      {!!a.alerte && <span className="badge red" style={{ marginLeft:4 }}>⚠ Critique</span>}
                    </div>
                    {a.resultats && (
                      <div className="dx" style={{ color: a.alerte ? "var(--red)" : undefined }}>{a.resultats}</div>
                    )}
                  </div>
                ))
              }
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h2>Ordonnances</h2></div>
            <div className="card-body">
              {ordos.length === 0
                ? <div className="empty">Aucune ordonnance.</div>
                : ordos.map(o => {
                  let meds = [];
                  try { meds = JSON.parse(o.medicaments_json || "[]"); } catch {}
                  return (
                    <div className="timeline-item" key={o.id}>
                      <div className="meta">{fmtDate(o.date)} · {o.medecin}</div>
                      <div className="motif">
                        Ordonnance{" "}
                        <span className={`badge ${ordoBadge(o.statut)}`} style={{ marginLeft:6 }}>{o.statut}</span>
                      </div>
                      {meds.map((m, i) => (
                        <div className="dx" key={i}>
                          <b>{m.nom}</b>{m.dose ? ` — ${m.dose}` : ""}{m.duree ? `, ${m.duree}` : ""}
                          {m.instructions && <span style={{ color:"var(--muted)" }}> · {m.instructions}</span>}
                        </div>
                      ))}
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
