// Identité visuelle sénégalaise — illustrations SVG originales (sans droits tiers).

export function Logo({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-label="Logo">
      <rect x="2" y="2" width="44" height="44" rx="12" fill="#117a3d" />
      {/* croix médicale */}
      <path d="M21 12h6v9h9v6h-9v9h-6v-9h-9v-6h9z" fill="#ffffff" />
      {/* étoile dorée */}
      <Star cx={37} cy={11} r={5} fill="#f4b400" />
    </svg>
  );
}

export function Star({ cx = 12, cy = 12, r = 10, fill = "#f4b400" }) {
  const pts = [];
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI / 180) * (-90 + i * 72);
    const ai = (Math.PI / 180) * (-90 + i * 72 + 36);
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
    pts.push(`${cx + r * 0.42 * Math.cos(ai)},${cy + r * 0.42 * Math.sin(ai)}`);
  }
  return <polygon points={pts.join(" ")} fill={fill} />;
}

export function Sun({ size = 110 }) {
  const rays = [];
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI / 180) * (i * 30);
    const x1 = 55 + 30 * Math.cos(a), y1 = 55 + 30 * Math.sin(a);
    const x2 = 55 + 42 * Math.cos(a), y2 = 55 + 42 * Math.sin(a);
    rays.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f4b400" strokeWidth="3" strokeLinecap="round" opacity="0.7" />);
  }
  return (
    <svg className="sun" width={size} height={size} viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
      <circle cx="55" cy="55" r="24" fill="#f4b400" opacity="0.85" />
      {rays}
    </svg>
  );
}

// Silhouette stylisée de baobab
export function Baobab({ width = 340 }) {
  return (
    <svg className="baobab" width={width} viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g fill="#0a5128" opacity="0.55">
        {/* tronc massif */}
        <path d="M150 320 C150 250 138 210 140 175 C120 178 96 172 84 160 C104 168 130 168 142 162
                 C140 150 150 140 150 140 C150 140 162 150 160 162 C176 170 206 168 226 158
                 C212 174 184 180 162 176 C164 212 152 252 152 320 Z" />
        {/* grosses branches */}
        <path d="M150 150 C120 120 70 118 40 132 C78 110 122 120 150 142 Z" />
        <path d="M152 150 C188 116 250 116 282 134 C244 108 196 118 152 142 Z" />
        <path d="M151 152 C150 110 156 70 150 40 C146 78 144 116 151 150 Z" />
        {/* petites ramifications */}
        <path d="M60 128 C44 116 30 118 22 126 C36 118 50 120 60 128 Z" />
        <path d="M270 130 C288 118 300 120 308 128 C294 120 282 122 270 130 Z" />
        <path d="M150 48 C140 36 132 36 126 42 C138 36 146 40 150 48 Z" />
        <path d="M150 48 C160 36 168 36 174 42 C162 36 154 40 150 48 Z" />
      </g>
    </svg>
  );
}
