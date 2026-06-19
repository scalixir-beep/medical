import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "../api.js";
import { fmtDate, age } from "../utils.js";
import { useToast } from "../components/Toast.jsx";
import { SkeletonTable } from "../components/Skeleton.jsx";

const LIMIT  = 15;
const EMPTY  = { nom:"", prenom:"", date_naissance:"", sexe:"F", telephone:"", adresse:"", groupe_sanguin:"" };

export default function Patients() {
  const toast = useToast();
  const [list,     setList]     = useState([]);
  const [total,    setTotal]    = useState(0);
  const [pages,    setPages]    = useState(1);
  const [page,     setPage]     = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [q,        setQ]        = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState(EMPTY);
  const [error,    setError]    = useState("");
  const navigate = useNavigate();

  function load(query = q, p = page) {
    setLoading(true);
    api.get(`/api/patients?q=${encodeURIComponent(query)}&page=${p}&limit=${LIMIT}`)
      .then(res => { setList(res.data || []); setTotal(res.total || 0); setPages(res.pages || 1); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(q, 1); setPage(1); }, []);

  function onSearch(e) {
    const v = e.target.value;
    setQ(v); setPage(1); load(v, 1);
  }

  function goPage(p) { setPage(p); load(q, p); }

  async function submit(e) {
    e.preventDefault(); setError("");
    try {
      await api.post("/api/patients", form);
      setForm(EMPTY); setShowForm(false); load(q, 1); setPage(1);
      toast(`Dossier patient créé avec succès.`);
    } catch (err) { setError(err.message); toast(err.message, "error"); }
  }

  const set = k => e => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <div className="page-head">
        <h1>Patients</h1>
        <p>{total} dossier{total > 1 ? "s" : ""} enregistré{total > 1 ? "s" : ""}.</p>
      </div>

      <div className="toolbar">
        <div className="search">
          <input placeholder="Rechercher par nom, prénom ou code IPP…" value={q} onChange={onSearch}/>
        </div>
        <button className="btn" onClick={() => setShowForm(s => !s)}>
          {showForm ? "Fermer" : "+ Nouveau patient"}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom:18 }}>
          <div className="card-head"><h2>Nouveau dossier patient</h2></div>
          <div className="card-body">
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={submit}>
              <div className="form-grid">
                <label className="field"><span>Nom *</span><input value={form.nom} onChange={set("nom")} required/></label>
                <label className="field"><span>Prénom *</span><input value={form.prenom} onChange={set("prenom")} required/></label>
                <label className="field"><span>Date de naissance</span><input type="date" value={form.date_naissance} onChange={set("date_naissance")}/></label>
                <label className="field"><span>Sexe</span>
                  <select value={form.sexe} onChange={set("sexe")}>
                    <option value="F">Féminin</option><option value="M">Masculin</option>
                  </select>
                </label>
                <label className="field"><span>Téléphone</span><input value={form.telephone} onChange={set("telephone")}/></label>
                <label className="field"><span>Groupe sanguin</span>
                  <select value={form.groupe_sanguin} onChange={set("groupe_sanguin")}>
                    <option value="">—</option>
                    {["O+","O-","A+","A-","B+","B-","AB+","AB-"].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </label>
              </div>
              <label className="field"><span>Adresse</span><input value={form.adresse} onChange={set("adresse")}/></label>
              <div className="form-actions">
                <button className="btn">Enregistrer le patient</button>
                <button type="button" className="btn ghost" onClick={() => { setShowForm(false); setError(""); }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body" style={{ padding:0 }}>
          {loading ? (
            <SkeletonTable rows={LIMIT} cols={6}/>
          ) : list.length === 0 ? (
            <div className="empty">Aucun patient trouvé.</div>
          ) : (
            <table>
              <thead>
                <tr><th>Code IPP</th><th>Nom complet</th><th>Sexe</th><th>Âge</th><th>Téléphone</th><th>Groupe</th></tr>
              </thead>
              <tbody>
                {list.map(p => (
                  <tr key={p.id} className="clickable" onClick={() => navigate(`/patients/${p.id}`)}>
                    <td><span className="code">{p.code}</span></td>
                    <td>{p.prenom} {p.nom}</td>
                    <td>{p.sexe === "F" ? "Féminin" : p.sexe === "M" ? "Masculin" : "—"}</td>
                    <td>{age(p.date_naissance)}</td>
                    <td>{p.telephone || "—"}</td>
                    <td>{p.groupe_sanguin ? <span className="badge blue">{p.groupe_sanguin}</span> : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="pagination">
            <button className="pag-btn" disabled={page===1} onClick={() => goPage(page-1)}>
              <ChevronLeft size={14}/>
            </button>
            {Array.from({ length: pages }, (_, i) => i+1).map(p => (
              <button key={p} className={`pag-btn${page===p?" pag-active":""}`} onClick={() => goPage(p)}>{p}</button>
            ))}
            <button className="pag-btn" disabled={page===pages} onClick={() => goPage(page+1)}>
              <ChevronRight size={14}/>
            </button>
            <span className="pag-info">{(page-1)*LIMIT+1}–{Math.min(page*LIMIT, total)} sur {total}</span>
          </div>
        )}
      </div>
    </div>
  );
}
