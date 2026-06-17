import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api.js";
import { fmtDate, age, statusBadge } from "../utils.js";
import { useAuth } from "../auth.jsx";
import { can } from "../perms.js";

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [cons, setCons] = useState({ motif: "", diagnostic: "", traitement: "" });
  const [rdv, setRdv] = useState({ date: "", heure: "", motif: "" });
  const [showCons, setShowCons] = useState(false);
  const [showRdv, setShowRdv] = useState(false);

  function load() {
    api.get(`/api/patients/${id}`).then(setPatient).catch(() => setPatient(false));
  }
  useEffect(() => { load(); }, [id]);

  if (patient === false) return <div className="empty">Patient introuvable.</div>;
  if (!patient) return <div className="empty">Chargement…</div>;

  async function addCons(e) {
    e.preventDefault();
    await api.post("/api/consultations", { patient_id: patient.id, ...cons });
    setCons({ motif: "", diagnostic: "", traitement: "" });
    setShowCons(false);
    load();
  }
  async function addRdv(e) {
    e.preventDefault();
    await api.post("/api/rendezvous", { patient_id: patient.id, ...rdv });
    setRdv({ date: "", heure: "", motif: "" });
    setShowRdv(false);
    load();
  }
  async function remove() {
    if (!confirm("Supprimer définitivement ce dossier patient ?")) return;
    await api.del(`/api/patients/${patient.id}`);
    navigate("/patients");
  }

  return (
    <div>
      <Link className="back-link" to="/patients">← Retour aux patients</Link>

      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-head">
          <h2>{patient.prenom} {patient.nom} <span className="code" style={{ marginLeft: 8 }}>{patient.code}</span></h2>
          {can(user, "patientDelete") && <button className="btn danger sm" onClick={remove}>Supprimer</button>}
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

      <div className="grid-2">
        {/* Consultations */}
        <div className="card">
          <div className="card-head">
            <h2>Historique des consultations</h2>
            {can(user, "consultationCreate") &&
              <button className="btn ghost sm" onClick={() => setShowCons((s) => !s)}>{showCons ? "Fermer" : "+ Ajouter"}</button>}
          </div>
          <div className="card-body">
            {!can(user, "consultations") ? (
              <div className="notice">Les actes cliniques sont réservés au personnel médical.</div>
            ) : (<>
            {showCons && (
              <form onSubmit={addCons} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
                <label className="field"><span>Motif</span><input value={cons.motif} onChange={(e) => setCons({ ...cons, motif: e.target.value })} required /></label>
                <label className="field"><span>Diagnostic</span><input value={cons.diagnostic} onChange={(e) => setCons({ ...cons, diagnostic: e.target.value })} /></label>
                <label className="field"><span>Traitement</span><textarea value={cons.traitement} onChange={(e) => setCons({ ...cons, traitement: e.target.value })} /></label>
                <button className="btn sm">Enregistrer la consultation</button>
              </form>
            )}
            {patient.consultations.length === 0 ? (
              <div className="empty">Aucune consultation.</div>
            ) : patient.consultations.map((c) => (
              <div className="timeline-item" key={c.id}>
                <div className="meta">{fmtDate(c.date)} · {c.medecin}</div>
                <div className="motif">{c.motif}</div>
                {c.diagnostic && <div className="dx"><b>Diagnostic :</b> {c.diagnostic}</div>}
                {c.traitement && <div className="dx"><b>Traitement :</b> {c.traitement}</div>}
              </div>
            ))}
            </>)}
          </div>
        </div>

        {/* Rendez-vous */}
        <div className="card">
          <div className="card-head">
            <h2>Rendez-vous</h2>
            <button className="btn ghost sm" onClick={() => setShowRdv((s) => !s)}>{showRdv ? "Fermer" : "+ Ajouter"}</button>
          </div>
          <div className="card-body">
            {showRdv && (
              <form onSubmit={addRdv} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
                <div className="form-grid">
                  <label className="field"><span>Date</span><input type="date" value={rdv.date} onChange={(e) => setRdv({ ...rdv, date: e.target.value })} required /></label>
                  <label className="field"><span>Heure</span><input type="time" value={rdv.heure} onChange={(e) => setRdv({ ...rdv, heure: e.target.value })} /></label>
                </div>
                <label className="field"><span>Motif</span><input value={rdv.motif} onChange={(e) => setRdv({ ...rdv, motif: e.target.value })} /></label>
                <button className="btn sm">Planifier le rendez-vous</button>
              </form>
            )}
            {patient.rendezvous.length === 0 ? (
              <div className="empty">Aucun rendez-vous.</div>
            ) : patient.rendezvous.map((r) => (
              <div className="timeline-item" key={r.id}>
                <div className="meta">{fmtDate(r.date)}{r.heure ? ` · ${r.heure}` : ""}</div>
                <div className="motif">{r.motif || "Rendez-vous"} <span className={`badge ${statusBadge(r.statut)}`} style={{ marginLeft: 6 }}>{r.statut}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
