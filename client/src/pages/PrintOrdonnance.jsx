import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api.js";
import { fmtDate, age } from "../utils.js";

export default function PrintOrdonnance() {
  const { id } = useParams();
  const [o, setO] = useState(null);

  useEffect(() => {
    api.get(`/api/ordonnances/${id}`).then(setO).catch(() => setO(false));
  }, [id]);

  if (o === false) return <div style={{ padding:40 }}>Ordonnance introuvable.</div>;
  if (!o)          return <div style={{ padding:40 }}>Chargement…</div>;

  let meds = [];
  try { meds = JSON.parse(o.medicaments_json || "[]"); } catch {}

  const today = new Date().toLocaleDateString("fr-FR", { day:"numeric", month:"long", year:"numeric" });

  return (
    <div className="print-page print-ordo">
      {/* Actions */}
      <div className="print-actions no-print">
        <button className="btn" onClick={() => window.print()}>🖨 Imprimer / Exporter PDF</button>
        <Link className="btn ghost" to="/pharmacie">← Retour Pharmacie</Link>
      </div>

      {/* En-tête établissement */}
      <div className="print-header">
        <div>
          <div className="print-title">ORDONNANCE MÉDICALE</div>
          <div className="print-subtitle">Établissement Public de Santé de Niveau 2 — République du Sénégal</div>
        </div>
        <div className="print-date">{today}</div>
      </div>

      {/* Médecin prescripteur */}
      <div className="print-ordo-medecin">
        <div className="print-label">Médecin prescripteur</div>
        <div className="print-bold" style={{ fontSize:15 }}>{o.medecin || "—"}</div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, margin:"14px 0" }}>
        {/* Patient */}
        <div className="print-box">
          <div className="print-box-title">PATIENT</div>
          <div className="print-bold" style={{ fontSize:14 }}>{o.prenom} {o.nom}</div>
          <div style={{ fontSize:12, color:"#555", margin:"4px 0" }}>IPP : {o.code}</div>
          {o.date_naissance && (
            <div style={{ fontSize:12, color:"#555" }}>
              Né(e) le {fmtDate(o.date_naissance)} — {age(o.date_naissance)}
            </div>
          )}
          {o.adresse && (
            <div style={{ fontSize:12, color:"#555", marginTop:4 }}>{o.adresse}</div>
          )}
        </div>
        {/* Référence */}
        <div className="print-box">
          <div className="print-box-title">INFORMATIONS</div>
          <div style={{ fontSize:12 }}>
            <div style={{ marginBottom:6 }}>
              <span className="print-label">Date de prescription : </span>
              <span className="print-bold">{fmtDate(o.date)}</span>
            </div>
            <div style={{ marginBottom:6 }}>
              <span className="print-label">N° ordonnance : </span>
              <span className="print-bold">{String(o.id).padStart(6,"0")}</span>
            </div>
            <div>
              <span className="print-label">Statut : </span>
              <span className="print-bold">{o.statut}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Médicaments */}
      <div className="print-section-title">MÉDICAMENTS PRESCRITS</div>
      {meds.length === 0 ? (
        <p style={{ color:"#666", fontStyle:"italic" }}>Aucun médicament.</p>
      ) : (
        <table className="print-table print-meds-table">
          <thead>
            <tr><th>#</th><th>Médicament</th><th>Dose</th><th>Durée</th><th>Instructions</th></tr>
          </thead>
          <tbody>
            {meds.map((m, i) => (
              <tr key={i}>
                <td style={{ textAlign:"center", fontWeight:700 }}>{i + 1}</td>
                <td className="print-bold">{m.nom}</td>
                <td>{m.dose || "—"}</td>
                <td>{m.duree || "—"}</td>
                <td style={{ fontStyle:"italic", color:"#555" }}>{m.instructions || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Signature */}
      <div className="print-signature">
        <div>
          <div className="print-label">Signature et cachet du médecin</div>
          <div className="print-sign-box"/>
        </div>
        <div className="print-validity">
          <div style={{ fontSize:11, color:"#666" }}>
            Ordonnance valable 3 mois à compter de la date de prescription.
          </div>
          <div style={{ fontSize:11, color:"#666", marginTop:4 }}>
            Document confidentiel — Usage médical exclusif.
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <div className="print-footer">
        <span>EPS2 · Dossier Patient v2.0 · République du Sénégal</span>
        <span>Ordonnance n° {String(o.id).padStart(6,"0")}</span>
      </div>
    </div>
  );
}
