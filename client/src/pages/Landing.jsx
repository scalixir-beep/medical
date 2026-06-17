import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { Logo, Sun } from "../components/Brand.jsx";
import { HealthIllustration } from "../components/HealthIllustration.jsx";
import {
  FolderOpen, BarChart2, ShieldCheck, CalendarCheck,
  ClipboardList, UserCog, LayoutDashboard, UserRound,
  Activity, Calendar, Users, TrendingUp,
  Lock, Shield, Zap, FileCheck,
  ChevronRight, ChevronDown, Heart,
} from "lucide-react";

/* ── KPI counter animation ── */
function KpiCounter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const delay = setTimeout(() => {
      let frame = 0;
      const total = 45;
      const tick = () => {
        frame++;
        setVal(Math.round((frame / total) * to));
        if (frame < total) requestAnimationFrame(tick);
        else setVal(to);
      };
      requestAnimationFrame(tick);
    }, 500);
    return () => clearTimeout(delay);
  }, [to]);
  return <>{val}{suffix}</>;
}

/* ── App Mockup SVG (section Preview) ── */
function AppMockup() {
  const bars = [44, 66, 38, 82, 56, 78, 60];
  return (
    <svg viewBox="0 0 540 360" className="lp-mockup" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lpSb2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f6e37"/>
          <stop offset="100%" stopColor="#083f20"/>
        </linearGradient>
        <clipPath id="lpCk2"><rect width="540" height="360" rx="14"/></clipPath>
      </defs>
      <g clipPath="url(#lpCk2)">
        <rect width="540" height="360" fill="#f2f7f3"/>
        <rect width="90" height="360" fill="url(#lpSb2)"/>
        <rect x="9"  y="12" width="24" height="24" rx="5" fill="#117a3d"/>
        <path d="M18 18 h5 v4 h4 v4 h-4 v4 h-5 v-4 h-4 v-4 z" fill="white"/>
        <line x1="9" y1="46" x2="81" y2="46" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>
        <rect x="7"  y="54" width="76" height="26" rx="6" fill="rgba(255,255,255,0.16)"/>
        <rect x="7"  y="54" width="3"  height="26" rx="1.5" fill="#f4b400"/>
        <rect x="15" y="62" width="12" height="10" rx="2.5" fill="rgba(255,255,255,0.5)"/>
        <rect x="31" y="64" width="34" height="6"  rx="3"   fill="rgba(255,255,255,0.75)"/>
        {[88, 122, 156, 190].map((y, i) => (
          <g key={i}>
            <rect x="15" y={y+2}  width="12" height="10" rx="2.5" fill="rgba(255,255,255,0.22)"/>
            <rect x="31" y={y+4}  width={[28,32,24,30][i]} height="6" rx="3" fill="rgba(255,255,255,0.18)"/>
          </g>
        ))}
        <rect x="90" y="0"  width="450" height="44" fill="white"/>
        <rect x="90" y="43" width="450" height="1"  fill="#dde8e0"/>
        <rect x="106" y="15" width="96" height="13" rx="4" fill="#e6f2ea"/>
        <circle cx="516" cy="22" r="13" fill="#117a3d"/>
        {[0,1,2,3].map(i => {
          const x = 106 + i*102, gold = i===2;
          return (
            <g key={i}>
              <rect x={x} y="55" width="90" height="68" rx="8" fill="white" stroke="#dde8e0" strokeWidth="0.8"/>
              <rect x={x} y="55" width="3"  height="68" rx="1.5" fill={gold?"#f4b400":"#117a3d"}/>
              <circle cx={x+17} cy={73} r="9" fill={gold?"#f9efd7":"#e6f2ea"}/>
              <rect x={x+5} y={88}  width="38" height="11" rx="3" fill={gold?"#b9851f":"#0c5c2e"} opacity="0.8"/>
              <rect x={x+5} y={105} width="56" height="8"  rx="3" fill="#e6f2ea"/>
            </g>
          );
        })}
        <rect x="106" y="133" width="252" height="162" rx="9" fill="white" stroke="#dde8e0" strokeWidth="0.8"/>
        <rect x="120" y="148" width="110" height="9" rx="3" fill="#1d2a22" opacity="0.6"/>
        <rect x="120" y="161" width="76"  height="7" rx="3" fill="#e6f2ea"/>
        {[238,220,202].map((y,i) => <line key={i} x1="124" y1={y} x2="344" y2={y} stroke="#eef3ef" strokeWidth="0.7"/>)}
        {bars.map((h,i) => <rect key={i} x={126+i*30} y={288-h} width="18" height={h} rx="3" fill="#117a3d" opacity={0.6+i*0.05}/>)}
        <line x1="122" y1="288" x2="344" y2="288" stroke="#dde8e0" strokeWidth="0.7"/>
        {bars.map((_,i) => <rect key={i} x={128+i*30} y="292" width="14" height="5" rx="2" fill="#e6f2ea"/>)}
        <rect x="368" y="133" width="162" height="162" rx="9" fill="white" stroke="#dde8e0" strokeWidth="0.8"/>
        <rect x="382" y="148" width="84" height="9" rx="3" fill="#1d2a22" opacity="0.6"/>
        <rect x="382" y="161" width="64" height="7" rx="3" fill="#e6f2ea"/>
        <path d="M449,237 L449,191 A46,46 0 0,1 489,260 Z" fill="#117a3d"/>
        <path d="M449,237 L489,260 A46,46 0 0,1 419,272 Z" fill="#f4b400"/>
        <path d="M449,237 L419,272 A46,46 0 0,1 449,191 Z" fill="#c0392b" opacity="0.65"/>
        <circle cx="449" cy="237" r="23" fill="white"/>
        <circle cx="382" cy="292" r="4" fill="#117a3d"/>
        <rect x="390" y="289" width="22" height="6" rx="2" fill="#e6f2ea"/>
        <circle cx="420" cy="292" r="4" fill="#f4b400"/>
        <rect x="428" y="289" width="22" height="6" rx="2" fill="#e6f2ea"/>
      </g>
    </svg>
  );
}

/* ── FAQ accordion ── */
const FAQ_ITEMS = [
  {
    q: "Qui peut utiliser la plateforme ?",
    a: "La plateforme est réservée au personnel autorisé de l'établissement : administrateurs, médecins et agents d'accueil. Chaque compte est créé et géré par l'administrateur système.",
  },
  {
    q: "Les données patients sont-elles sécurisées ?",
    a: "Oui. Toutes les données sont hébergées localement sur les serveurs de l'établissement (aucun cloud tiers). L'accès est contrôlé par rôle et chaque action est tracée pour garantir la conformité réglementaire.",
  },
  {
    q: "Comment obtenir mes identifiants de connexion ?",
    a: "Vos identifiant et mot de passe sont fournis par l'administrateur système de votre établissement. Si vous n'avez pas encore reçu vos accès, contactez votre responsable informatique.",
  },
  {
    q: "La plateforme est-elle utilisable sur mobile ou tablette ?",
    a: "La plateforme est responsive et s'adapte aux tablettes et smartphones. Pour une expérience optimale, l'utilisation sur ordinateur de bureau est recommandée.",
  },
  {
    q: "Quels navigateurs sont pris en charge ?",
    a: "La plateforme fonctionne avec tous les navigateurs modernes : Google Chrome, Mozilla Firefox, Microsoft Edge et Safari. Une version récente est recommandée pour bénéficier de toutes les fonctionnalités.",
  },
  {
    q: "Comment signaler un problème technique ?",
    a: "Contactez l'administrateur système de votre établissement, qui pourra diagnostiquer le dysfonctionnement ou escalader la demande au support technique compétent.",
  },
];

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="lp-faq-list">
      {FAQ_ITEMS.map((item, i) => (
        <div className={`lp-faq-item${open === i ? " open" : ""}`} key={i}>
          <button
            className="lp-faq-q"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span>{item.q}</span>
            <ChevronDown size={18} strokeWidth={2} className="lp-faq-chevron" />
          </button>
          <div className="lp-faq-a" aria-hidden={open !== i}>
            <p>{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Roles card ── */
function RolesCard() {
  const roles = [
    { bg:"#efe3c2", color:"#8a6a00", icon:"⚙️", label:"Administrateur", perms:"Tous les modules · Gestion utilisateurs · Config" },
    { bg:"#e6f2ea", color:"#0c5c2e", icon:"🩺", label:"Médecin",          perms:"Dossiers patients · Consultations · Rendez-vous" },
    { bg:"#e2ecf6", color:"#2b5a8a", icon:"🏥", label:"Accueil",           perms:"Patients · Rendez-vous · Tableau de bord" },
  ];
  return (
    <div className="lp-roles-card">
      {roles.map((r,i) => (
        <div className="lp-role-row" key={i}>
          <div className="lp-role-ico" style={{ background:r.bg, color:r.color }}>{r.icon}</div>
          <div>
            <div className="lp-role-name" style={{ color:r.color }}>{r.label}</div>
            <div className="lp-role-perms">{r.perms}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   LANDING PAGE
══════════════════════════════════════════ */
export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  /* Scroll-reveal */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* Active nav highlight */
  useEffect(() => {
    const ids = ["features", "preview", "modules", "security", "faq"];
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.35 }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  if (user) return null;

  const features = [
    { Icon: FolderOpen,    title: "Dossier patient centralisé",   desc: "Accédez en temps réel à l'historique complet de chaque patient : consultations, diagnostics, traitements et rendez-vous." },
    { Icon: BarChart2,     title: "Tableau de bord analytique",    desc: "Visualisez les KPIs de l'établissement avec des graphiques interactifs : activité mensuelle, démographie, flux de rendez-vous." },
    { Icon: ShieldCheck,   title: "Contrôle d'accès multi-rôles",  desc: "Administrateurs, médecins et personnel d'accueil disposent chacun d'un périmètre adapté à leurs responsabilités." },
    { Icon: CalendarCheck, title: "Gestion des rendez-vous",       desc: "Planifiez et suivez les rendez-vous avec des statuts en temps réel : Planifié, Honoré, Annulé." },
    { Icon: ClipboardList, title: "Suivi des consultations",       desc: "Enregistrez chaque consultation avec motif, diagnostic et notes cliniques dans une interface intuitive et structurée." },
    { Icon: UserCog,       title: "Gestion des utilisateurs",      desc: "Créez et administrez les comptes du personnel soignant et administratif avec attribution fine des droits d'accès." },
  ];

  const modules = [
    { Icon: LayoutDashboard, name: "Tableau de bord", desc: "KPIs et graphiques temps réel" },
    { Icon: UserRound,       name: "Patients",         desc: "Dossiers et suivi complet"    },
    { Icon: Activity,        name: "Consultations",    desc: "Historique médical complet"   },
    { Icon: Calendar,        name: "Rendez-vous",      desc: "Planning et gestion des RDV"  },
    { Icon: Users,           name: "Utilisateurs",     desc: "Comptes et permissions"       },
    { Icon: TrendingUp,      name: "Analytique",       desc: "Rapports et indicateurs"      },
  ];

  const trust = [
    { Icon: Lock,      label: "Données hébergées sur site"  },
    { Icon: Shield,    label: "Accès par rôles"             },
    { Icon: FileCheck, label: "Traçabilité complète"        },
    { Icon: Zap,       label: "Temps réel"                  },
  ];

  return (
    <div className="lp">

      {/* ─── Navbar ─── */}
      <header className="lp-nav">
        <div className="lp-wrap lp-nav-inner">
          <div className="lp-nav-brand">
            <Logo size={36}/>
            <div>
              <span className="lp-brand-name">Dossier Patient</span>
              <span className="lp-brand-badge">EPS2</span>
            </div>
          </div>
          <nav className="lp-nav-links">
            {[["features","Fonctionnalités"],["preview","Aperçu"],["modules","Modules"],["security","Sécurité"],["faq","FAQ"]].map(([id, label]) => (
              <a key={id} href={`#${id}`} className={activeSection === id ? "lp-nav-active" : ""}>{label}</a>
            ))}
          </nav>
          <Link to="/login" className="lp-nav-cta">
            Se connecter <ChevronRight size={15} strokeWidth={2.5}/>
          </Link>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="lp-hero">
        <div className="lp-wrap lp-hero-inner">

          {/* Texte gauche */}
          <div className="lp-hero-text">
            <div className="lp-flagbar">
              <span style={{ background:"#00853F" }}/>
              <span style={{ background:"#FDEF42" }}/>
              <span style={{ background:"#E31B23" }}/>
              <span className="lp-flag-label">République du Sénégal</span>
            </div>
            <h1 className="lp-hero-h1">
              La santé numérique<br/>
              au service des{" "}
              <span className="lp-hero-accent">EPS2</span>
            </h1>
            <p className="lp-hero-sub">
              Centralisez le dossier patient, fluidifiez le parcours de soins et fiabilisez les données médicales de votre établissement de santé.
            </p>
            <div className="lp-hero-actions">
              <Link to="/login" className="lp-btn-gold-hero">
                Accéder à la plateforme
              </Link>
              <a href="#features" className="lp-btn-outline">
                Découvrir <ChevronRight size={15}/>
              </a>
            </div>
            <div className="lp-hero-kpis">
              <div className="lp-kpi"><span className="lp-kpi-n"><KpiCounter to={3}/></span><span className="lp-kpi-l">Rôles</span></div>
              <div className="lp-kpi-sep"/>
              <div className="lp-kpi"><span className="lp-kpi-n"><KpiCounter to={5}/></span><span className="lp-kpi-l">Modules</span></div>
              <div className="lp-kpi-sep"/>
              <div className="lp-kpi"><span className="lp-kpi-n"><KpiCounter to={100} suffix="%"/></span><span className="lp-kpi-l">Local</span></div>
              <div className="lp-kpi-sep"/>
              <div className="lp-kpi"><span className="lp-kpi-n">EPS2</span><span className="lp-kpi-l">Certifié</span></div>
            </div>
          </div>

          {/* Illustration droite */}
          <div className="lp-hero-visual">
            <HealthIllustration className="lp-health-illus"/>
          </div>
        </div>

        {/* Décorations */}
        <Sun size={110}/>
      </section>

      {/* ─── Features ─── */}
      <section className="lp-section" id="features">
        <div className="lp-wrap">
          <div className="lp-sec-head reveal">
            <span className="lp-tag">Fonctionnalités</span>
            <h2 className="lp-sec-h2">Tout ce dont votre établissement a besoin</h2>
            <p className="lp-sec-desc">Une plateforme complète pensée pour les équipes médicales et administratives des hôpitaux publics sénégalais.</p>
          </div>
          <div className="lp-feat-grid">
            {features.map(({ Icon, title, desc }, i) => (
              <div className="lp-feat-card reveal" style={{ "--d": `${i * 0.08}s` }} key={i}>
                <div className="lp-feat-ico"><Icon size={22} strokeWidth={1.6}/></div>
                <h3 className="lp-feat-title">{title}</h3>
                <p className="lp-feat-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Platform Preview ─── */}
      <section className="lp-section lp-alt lp-preview" id="preview">
        <div className="lp-wrap">
          <div className="lp-sec-head reveal">
            <span className="lp-tag">Aperçu de la plateforme</span>
            <h2 className="lp-sec-h2">Une interface claire, pensée pour le terrain</h2>
            <p className="lp-sec-desc">Tableau de bord avec KPIs, navigation latérale, graphiques analytiques — tout en un seul écran.</p>
          </div>
          <div className="lp-preview-wrap reveal">
            <AppMockup/>
          </div>
        </div>
      </section>

      {/* ─── Modules ─── */}
      <section className="lp-section" id="modules">
        <div className="lp-wrap">
          <div className="lp-sec-head reveal">
            <span className="lp-tag">Modules</span>
            <h2 className="lp-sec-h2">Un écosystème intégré</h2>
            <p className="lp-sec-desc">Six modules interconnectés couvrant l'ensemble du cycle de prise en charge du patient.</p>
          </div>
          <div className="lp-mod-grid">
            {modules.map(({ Icon, name, desc }, i) => (
              <div className="lp-mod-card reveal" style={{ "--d": `${i * 0.07}s` }} key={i}>
                <div className="lp-mod-ico"><Icon size={20} strokeWidth={1.6}/></div>
                <div>
                  <div className="lp-mod-name">{name}</div>
                  <div className="lp-mod-desc">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Security ─── */}
      <section className="lp-section lp-alt" id="security">
        <div className="lp-wrap lp-split">
          <div className="lp-split-left reveal">
            <span className="lp-tag">Sécurité & Conformité</span>
            <h2 className="lp-sec-h2 lp-left">Des données médicales protégées</h2>
            <p className="lp-sec-desc lp-left">Hébergement local, contrôle d'accès granulaire et traçabilité complète pour répondre aux exigences des établissements de santé publique.</p>
            <div className="lp-trust-wrap">
              {trust.map(({ Icon, label }, i) => (
                <span className="lp-trust-badge" key={i}>
                  <Icon size={14} strokeWidth={2}/> {label}
                </span>
              ))}
            </div>
          </div>
          <div className="reveal" style={{ "--d": "0.15s" }}><RolesCard/></div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="lp-section" id="faq">
        <div className="lp-wrap">
          <div className="lp-sec-head reveal">
            <span className="lp-tag">FAQ</span>
            <h2 className="lp-sec-h2">Questions fréquentes</h2>
            <p className="lp-sec-desc">Tout ce que vous devez savoir pour démarrer et utiliser la plateforme au quotidien.</p>
          </div>
          <FAQ />
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="lp-cta">
        <div className="lp-wrap lp-cta-inner">
          <div className="lp-cta-text">
            <div className="lp-cta-icon"><Heart size={32} fill="rgba(255,255,255,0.15)" strokeWidth={1.5}/></div>
            <h2>Prêt à digitaliser votre établissement ?</h2>
            <p>Accédez dès maintenant à la plateforme de démonstration complète.</p>
          </div>
          <Link to="/login" className="lp-btn-gold-hero lp-btn-lg">
            Commencer maintenant <ChevronRight size={17} strokeWidth={2.5}/>
          </Link>
        </div>
        <Sun size={200}/>
      </section>

      {/* ─── Footer ─── */}
      <footer className="lp-footer">
        <div className="lp-wrap lp-footer-inner">
          <div className="lp-footer-brand">
            <Logo size={30}/>
            <div>
              <div className="lp-footer-name">Dossier Patient EPS2</div>
              <div className="lp-footer-sub">Établissement Public de Santé de Niveau 2</div>
            </div>
          </div>
          <div className="lp-footer-copy">© 2025 — République du Sénégal · Prototype v2</div>
        </div>
        <div className="lp-footer-flag">
          <span style={{ background:"#00853F" }}/>
          <span style={{ background:"#FDEF42" }}/>
          <span style={{ background:"#E31B23" }}/>
        </div>
      </footer>
    </div>
  );
}
