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
                <tr><th>Date</th><th>Patient</th><th>Motif</th><th>Constantes</th><th>Diagnostic</th><th>Médecin</th></tr>
              </thead>
              <tbody>
                {list.map((c) => (
                  <tr key={c.id} className="clickable" onClick={() => navigate(`/patients/${c.patient_id}`)}>
                    <td style={{ whiteSpace:"nowrap" }}>{fmtDate(c.date)}</td>
                    <td>
                      <span style={{ fontWeight:600 }}>{c.prenom} {c.nom}</span>
                      <span className="code" style={{ marginLeft:6 }}>{c.code}</span>
                    </td>
                    <td>{c.motif || "—"}</td>
                    <td>
                      {(c.tension || c.temperature || c.fc) ? (
                        <div className="vitals-row vitals-compact">
                          {c.tension     && <span className="vital-chip">TA {c.tension}</span>}
                          {c.temperature && <span className="vital-chip">T° {c.temperature}°</span>}
                          {c.fc          && <span className="vital-chip">FC {c.fc}</span>}
                        </div>
                      ) : <span style={{ color:"var(--muted)" }}>—</span>}
                    </td>
                    <td>{c.diagnostic || "—"}</td>
                    <td style={{ color:"var(--muted)", fontSize:13 }}>{c.medecin || "—"}</td>
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
