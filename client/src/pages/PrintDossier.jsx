import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api.js";
import { fmtDate, age } from "../utils.js";

export default function PrintDossier() {
  const { id } = useParams();
  const [p, setP] = useState(null);

  useEffect(() => {
    api.get(`/api/patients/${id}`).then(setP).catch(() => setP(false));
  }, [id]);

  if (p === false) return <div style={{ padding:40 }}>Patient introuvable.</div>;
  if (!p) return <div style={{ padding:40 }}>Chargement…</div>;

  const cons  = p.consultations || [];
  const today = new Date().toLocaleDateString("fr-FR", { day:"numeric", month:"long", year:"numeric" });

  return (
    <div className="print-page">
      {/* Actions — masquées à l'impression */}
      <div className="print-actions no-print">
        <button className="btn" onClick={() => window.print()}>🖨 Imprimer / Exporter PDF</button>
        <Link className="btn ghost" to={`/patients/${id}`}>← Retour</Link>
      </div>

      {/* En-tête */}
      <div className="print-header">
        <div>
          <div className="print-title">DOSSIER PATIENT</div>
          <div className="print-subtitle">Établissement Public de Santé de Niveau 2 — République du Sénégal</div>
        </div>
        <div className="print-date">Édité le {today}</div>
      </div>

      {/* Informations patient */}
      <table className="print-table print-info-table">
        <tbody>
          <tr>
            <td className="print-label">Code IPP</td>
            <td className="print-value print-ipp">{p.code}</td>
            <td className="print-label">Nom complet</td>
            <td className="print-value">{p.prenom} {p.nom}</td>
          </tr>
          <tr>
            <td className="print-label">Date de naissance</td>
            <td className="print-value">{fmtDate(p.date_naissance)} ({age(p.date_naissance)})</td>
            <td className="print-label">Sexe</td>
            <td className="print-value">{p.sexe === "F" ? "Féminin" : "Masculin"}</td>
          </tr>
          <tr>
            <td className="print-label">Téléphone</td>
            <td className="print-value">{p.telephone || "—"}</td>
            <td className="print-label">Groupe sanguin</td>
            <td className="print-value print-bold">{p.groupe_sanguin || "—"}</td>
          </tr>
          <tr>
            <td className="print-label">Adresse</td>
            <td className="print-value" colSpan="3">{p.adresse || "—"}</td>
          </tr>
        </tbody>
      </table>

      {/* Historique consultations */}
      <div className="print-section-title">HISTORIQUE DES CONSULTATIONS ({cons.length})</div>
      {cons.length === 0 ? (
        <p style={{ color:"#666", fontStyle:"italic" }}>Aucune consultation enregistrée.</p>
      ) : (
        <table className="print-table print-cons-table">
          <thead>
            <tr>
              <th>Date</th><th>Médecin</th><th>Motif</th><th>Constantes</th><th>Diagnostic</th><th>Traitement</th>
            </tr>
          </thead>
          <tbody>
            {cons.map(c => (
              <tr key={c.id}>
                <td style={{ whiteSpace:"nowrap" }}>{fmtDate(c.date)}</td>
                <td style={{ whiteSpace:"nowrap" }}>{c.medecin || "—"}</td>
                <td>{c.motif || "—"}</td>
                <td style={{ fontSize:11 }}>
                  {c.tension && <div>TA : {c.tension} mmHg</div>}
                  {c.temperature && <div>T° : {c.temperature}°C</div>}
                  {c.poids && <div>Poids : {c.poids} kg</div>}
                  {c.fc && <div>FC : {c.fc} bpm</div>}
                  {!c.tension && !c.temperature && !c.poids && !c.fc && "—"}
                </td>
                <td>{c.diagnostic || "—"}</td>
                <td>{c.traitement || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pied de page */}
      <div className="print-footer">
        <span>Document confidentiel — Usage médical exclusif</span>
        <span>CHRASNT · Dossier Patient Informatisé · Thiès</span>
      </div>
    </div>
  );
}
