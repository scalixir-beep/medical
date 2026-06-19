/* Composants skeleton loader — remplacent les "Chargement…" bruts */

/* Barre animée de base */
export function Sk({ w = "100%", h = 14, r = 6, style = {} }) {
  return (
    <span
      className="sk"
      style={{ width: w, height: h, borderRadius: r, display: "block", ...style }}
    />
  );
}

/* Squelette d'une carte KPI (stat) */
export function SkeletonStat() {
  return (
    <div className="ds-card" style={{ opacity: 0.7 }}>
      <Sk w={44} h={44} r={12} style={{ marginBottom: 14 }}/>
      <Sk w="55%" h={32} r={6} style={{ marginBottom: 8 }}/>
      <Sk w="75%" h={12} r={4} style={{ marginBottom: 12 }}/>
      <Sk w="50%" h={10} r={4}/>
      <div className="ds-bar" style={{ background: "var(--border)" }}/>
    </div>
  );
}

/* Squelette d'un tableau (N lignes × N colonnes) */
export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <table>
      <thead>
        <tr>
          {Array.from({ length: cols }, (_, i) => (
            <th key={i}><Sk w="60%" h={9} r={4}/></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }, (_, i) => (
          <tr key={i}>
            {Array.from({ length: cols }, (_, j) => (
              <td key={j}>
                <Sk w={`${50 + ((i + j) * 13) % 40}%`} h={11} r={4}/>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* Squelette d'un bloc timeline (fiche patient) */
export function SkeletonTimeline({ items = 3 }) {
  return (
    <div>
      {Array.from({ length: items }, (_, i) => (
        <div className="timeline-item" key={i} style={{ opacity: 0.7 }}>
          <Sk w="40%" h={10} r={4} style={{ marginBottom: 8 }}/>
          <Sk w="70%" h={12} r={4} style={{ marginBottom: 6 }}/>
          <Sk w="55%" h={10} r={4}/>
        </div>
      ))}
    </div>
  );
}

/* Squelette d'une card info (fiche patient header) */
export function SkeletonInfoCard() {
  return (
    <div className="card" style={{ marginBottom: 18, opacity: 0.7 }}>
      <div className="card-head">
        <Sk w={200} h={20} r={5}/>
      </div>
      <div className="card-body">
        <div className="info-grid">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i}>
              <Sk w="40%" h={9} r={4} style={{ marginBottom: 6 }}/>
              <Sk w="70%" h={13} r={4}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
