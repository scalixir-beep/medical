import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { api } from "../api.js";

export function GlobalSearch() {
  const [q,       setQ]       = useState("");
  const [results, setResults] = useState([]);
  const [open,    setOpen]    = useState(false);
  const [active,  setActive]  = useState(-1);
  const timer   = useRef(null);
  const wrapRef = useRef(null);
  const navigate = useNavigate();

  /* Debounce 280ms */
  useEffect(() => {
    if (!q.trim()) { setResults([]); setOpen(false); return; }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      api.get(`/api/patients?q=${encodeURIComponent(q.trim())}`)
        .then(data => {
          const list = Array.isArray(data) ? data : (data.data || []);
          setResults(list.slice(0, 6));
          setOpen(list.length > 0);
          setActive(-1);
        })
        .catch(() => {});
    }, 280);
    return () => clearTimeout(timer.current);
  }, [q]);

  /* Clic en dehors → fermer */
  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) close();
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function close() { setOpen(false); setActive(-1); }

  function pick(p) {
    setQ(""); close(); setResults([]);
    navigate(`/patients/${p.id}`);
  }

  function onKey(e) {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActive(a => Math.max(a - 1, -1)); }
    if (e.key === "Enter" && active >= 0) { e.preventDefault(); pick(results[active]); }
    if (e.key === "Escape")    { close(); }
  }

  return (
    <div className="gs-wrap" ref={wrapRef}>
      <div className="gs-input-row">
        <Search size={15} className="gs-icon"/>
        <input
          className="gs-input"
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={onKey}
          placeholder="Rechercher un patient…"
          autoComplete="off"
        />
        {q && (
          <button className="gs-clear" onClick={() => { setQ(""); close(); }}>
            <X size={13}/>
          </button>
        )}
      </div>

      {open && (
        <div className="gs-dropdown">
          {results.map((p, i) => (
            <button
              key={p.id}
              className={`gs-item${active === i ? " gs-active" : ""}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => pick(p)}
            >
              <div className="gs-name">{p.prenom} {p.nom}</div>
              <div className="gs-meta">
                <span className="code">{p.code}</span>
                {p.date_naissance && (
                  <span style={{ marginLeft: 8, color: "var(--muted)", fontSize: 12 }}>
                    {new Date().getFullYear() - new Date(p.date_naissance).getFullYear()} ans
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
