import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { fmtDate } from "../utils.js";

export default function Consultations() {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/consultations").then(setList).catch(() => {});
  }, []);

  return (
    <div>
      <div className="page-head">
        <h1>Consultations</h1>
        <p>Les 50 consultations les plus récentes, tous patients confondus.</p>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {list.length === 0 ? (
            <div className="empty">Aucune consultation enregistrée. Ouvrez un dossier patient pour en ajouter une.</div>
          ) : (
            <table>
              <thead>
                <tr><th>Date</th><th>Patient</th><th>Motif</th><th>Diagnostic</th><th>Médecin</th></tr>
              </thead>
              <tbody>
                {list.map((c) => (
                  <tr key={c.id} className="clickable" onClick={() => navigate(`/patients/${c.patient_id}`)}>
                    <td>{fmtDate(c.date)}</td>
                    <td>{c.prenom} {c.nom} <span className="code" style={{ marginLeft: 4 }}>{c.code}</span></td>
                    <td>{c.motif || "—"}</td>
                    <td>{c.diagnostic || "—"}</td>
                    <td>{c.medecin || "—"}</td>
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
