// Illustration médicale SVG — médecin avec tablette numérique (identité EPS2)
// Conçue pour fonds sombres (vert), utilise blanc + or de la charte.

export function HealthIllustration({ className = "" }) {
  return (
    <svg
      viewBox="0 0 420 500"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="hiGlow" cx="50%" cy="48%" r="52%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.13)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
      </defs>

      {/* Halo de fond */}
      <ellipse cx="210" cy="265" rx="196" ry="218" fill="url(#hiGlow)"/>

      {/* Anneaux décoratifs */}
      <circle cx="210" cy="265" r="190" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5"/>
      <circle cx="210" cy="265" r="148" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>

      {/* Ligne ECG de fond */}
      <path
        d="M0 305 L68 305 L84 272 L100 340 L116 255 L134 298 L152 298 L420 298"
        stroke="rgba(244,180,0,0.42)" strokeWidth="2.5" fill="none"
        strokeLinecap="round" strokeLinejoin="round"
      />

      {/* ── Corps — blouse blanche ── */}
      <path
        d="M132 238 Q132 418 132 418 Q132 432 150 432 L270 432 Q288 432 288 418 L288 238 Q258 224 210 222 Q162 224 132 238Z"
        fill="rgba(255,255,255,0.96)"
      />
      {/* Ombre légère sur la blouse */}
      <path
        d="M132 260 Q210 252 288 260 L288 238 Q258 224 210 222 Q162 224 132 238Z"
        fill="rgba(0,0,0,0.03)"
      />

      {/* ── Tête ── */}
      <circle cx="210" cy="160" r="52" fill="#fde8d2"/>

      {/* Cheveux */}
      <path
        d="M158 148 Q183 118 210 116 Q237 118 262 148 Q255 124 210 112 Q165 124 158 148Z"
        fill="#1c0e06"
      />
      <path d="M158 148 L158 160 Q162 150 168 146Z" fill="#1c0e06"/>
      <path d="M262 148 L262 160 Q258 150 252 146Z" fill="#1c0e06"/>

      {/* Visage */}
      <circle cx="196" cy="156" r="5"   fill="#5a3620" opacity="0.7"/>
      <circle cx="224" cy="156" r="5"   fill="#5a3620" opacity="0.7"/>
      <path d="M196 176 Q210 188 224 176" stroke="#5a3620" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

      {/* Revers de blouse */}
      <path
        d="M162 238 L180 272 L210 260 L240 272 L258 238 Q236 228 210 226 Q184 228 162 238Z"
        fill="rgba(236,248,240,0.9)"
      />

      {/* ── Stéthoscope ── */}
      <circle cx="180" cy="234" r="8" fill="#f4b400"/>
      <circle cx="240" cy="234" r="8" fill="#f4b400"/>
      <path
        d="M180 242 Q166 272 162 300 Q159 324 167 342 Q177 366 196 376 Q203 380 210 380 Q217 380 224 376 Q243 366 253 342 Q261 324 258 300 Q254 272 240 242"
        stroke="#f4b400" strokeWidth="6" fill="none" strokeLinecap="round"
      />
      {/* Pavillon */}
      <circle cx="210" cy="384" r="18" fill="#f4b400"/>
      <circle cx="210" cy="384" r="11" fill="#c98f00"/>
      <circle cx="210" cy="384" r="5"  fill="rgba(255,255,255,0.45)"/>

      {/* Croix médicale sur poche */}
      <rect x="201" y="282" width="18" height="52" rx="5" fill="#117a3d" opacity="0.88"/>
      <rect x="188" y="295" width="44" height="18" rx="5" fill="#117a3d" opacity="0.88"/>

      {/* ── Tablette numérique ── */}
      <rect x="126" y="372" width="168" height="114" rx="14" fill="#0c1c14"/>
      <rect x="134" y="380" width="152" height="98"  rx="9"  fill="#0b5c2c"/>

      {/* Contenu tablette */}
      <rect x="144" y="390" width="96" height="9" rx="4" fill="rgba(255,255,255,0.9)"/>
      <rect x="144" y="405" width="68" height="6" rx="3" fill="rgba(255,255,255,0.38)"/>
      <rect x="144" y="416" width="78" height="6" rx="3" fill="rgba(255,255,255,0.32)"/>
      <rect x="144" y="427" width="54" height="6" rx="3" fill="rgba(255,255,255,0.22)"/>
      {/* Mini ECG sur écran */}
      <polyline
        points="218,420 226,408 234,426 242,400 250,420 260,420 272,420"
        stroke="#f4b400" strokeWidth="2" fill="none"
        strokeLinecap="round" strokeLinejoin="round"
      />

      {/* ── Éléments flottants ── */}

      {/* Cœur — haut gauche */}
      <g opacity="0.88">
        <circle cx="44" cy="112" r="30" fill="rgba(255,255,255,0.09)"/>
        <path
          d="M44 128 C44 128 28 112 28 102 C28 93 35 89 44 97 C53 89 60 93 60 102 C60 112 44 128 44 128Z"
          fill="rgba(255,255,255,0.68)"
        />
      </g>

      {/* Croix — haut droit */}
      <g opacity="0.88">
        <circle cx="376" cy="100" r="28" fill="rgba(244,180,0,0.14)"/>
        <rect x="364" y="97" width="24" height="6" rx="3" fill="rgba(244,180,0,0.82)"/>
        <rect x="373" y="88" width="6"  height="24" rx="3" fill="rgba(244,180,0,0.82)"/>
      </g>

      {/* Fiche patient — droite flottante */}
      <g transform="translate(298,198)">
        <rect width="106" height="78" rx="11"
          fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        <circle cx="17" cy="20" r="11" fill="rgba(255,255,255,0.22)"/>
        <rect x="33" y="13" width="60" height="8"  rx="4" fill="rgba(255,255,255,0.52)"/>
        <rect x="33" y="26" width="44" height="5"  rx="2" fill="rgba(255,255,255,0.26)"/>
        <line x1="8" y1="42" x2="98" y2="42" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
        <rect x="8"  y="50" width="36" height="5" rx="2" fill="rgba(255,255,255,0.30)"/>
        <rect x="8"  y="61" width="62" height="5" rx="2" fill="rgba(255,255,255,0.18)"/>
      </g>

      {/* Badge KPI — gauche flottant */}
      <g transform="translate(4,318)">
        <rect width="96" height="66" rx="10"
          fill="rgba(255,255,255,0.11)" stroke="rgba(255,255,255,0.16)" strokeWidth="1"/>
        <rect width="3" height="66" rx="1.5" fill="#f4b400" opacity="0.9"/>
        <rect x="10" y="11" width="38" height="9" rx="3" fill="rgba(255,255,255,0.52)"/>
        <rect x="10" y="27" width="74" height="5" rx="2" fill="rgba(255,255,255,0.24)"/>
        <rect x="10" y="37" width="56" height="5" rx="2" fill="rgba(255,255,255,0.18)"/>
        <rect x="10" y="47" width="66" height="5" rx="2" fill="rgba(255,255,255,0.13)"/>
      </g>

      {/* Points décoratifs */}
      {[[58,228],[68,244],[54,256],[362,218],[374,232],[360,246]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="rgba(255,255,255,0.14)"/>
      ))}
    </svg>
  );
}
