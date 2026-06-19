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
  Bed, FlaskConical, Pill, History,
  Settings, Stethoscope, ArrowUp,
  CheckCircle, Layers, Clock,
  Sun as SunIcon, Moon,
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

/* ── App Mockup SVG — reproduction fidèle du vrai dashboard ── */
function AppMockup() {
  const F  = { fontFamily:"Inter, system-ui, sans-serif" };
  const M  = "#647a6c";   // muted
  const bars = [35, 55, 72, 92, 78, 98]; // hauteurs barres

  // Cartes KPI ligne 1
  const kpi1 = [
    { x:172, num:"12", lbl:"Patients enregistrés",  sub:"Dossiers actifs",          iBg:"#e6f2ea", bar:"#117a3d", nC:"#0c5c2e" },
    { x:362, num:"30", lbl:"Consultations",          sub:"Tous services confondus",  iBg:"#e2ecf6", bar:"#2b6ca3", nC:"#2b5a8a" },
    { x:552, num:"2",  lbl:"RDV aujourd'hui",        sub:null,                       iBg:"#f9efd7", bar:"#f4b400", nC:"#8a5c00" },
    { x:742, num:"4",  lbl:"RDV planifiés",          sub:null,                       iBg:"#e6f2ea", bar:"#117a3d", nC:"#0c5c2e" },
  ];

  // Cartes KPI ligne 2
  const kpi2 = [
    { x:172, num:"3", lbl:"Patients hospitalisés",  sub:"En cours de séjour",   iBg:"#e2ecf6", bar:"#2b6ca3", nC:"#2b5a8a" },
    { x:441, num:"2", lbl:"Analyses en attente",    sub:null,                    iBg:"#f9efd7", bar:"#b9851f", nC:"#8a5c00" },
    { x:710, num:"0", lbl:"Alertes stock pharmacie",sub:"Stocks suffisants",     iBg:"#e6f2ea", bar:"#117a3d", nC:"#0c5c2e" },
  ];

  return (
    <svg viewBox="0 0 920 580" className="lp-mockup" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lpSb2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f6e37"/>
          <stop offset="100%" stopColor="#083f20"/>
        </linearGradient>
        <clipPath id="lpCk2"><rect width="920" height="580" rx="16"/></clipPath>
      </defs>

      <g clipPath="url(#lpCk2)">
        {/* ── Fond ── */}
        <rect width="920" height="580" fill="#f2f7f3"/>

        {/* ══════════════ SIDEBAR ══════════════ */}
        <rect width="158" height="580" fill="url(#lpSb2)"/>

        {/* Logo */}
        <rect x="10" y="13" width="26" height="26" rx="6" fill="#117a3d"/>
        <path d="M20 19h6v5h5v5h-5v5h-6v-5h-5v-5h5z" fill="white"/>
        <text x="42" y="24" fill="white" fontSize="9.5" fontWeight="700" {...F}>Dossier Patient</text>
        <text x="42" y="35" fill="#a7d2b6" fontSize="8" {...F}>EPS2 · Sénégal</text>

        {/* Séparateur */}
        <line x1="10" y1="50" x2="148" y2="50" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>

        {/* Nav actif */}
        <rect x="8" y="56" width="142" height="28" rx="7" fill="rgba(255,255,255,0.17)"/>
        <rect x="8" y="56" width="3"   height="28" rx="1.5" fill="#f4b400"/>
        <rect x="18" y="64" width="13" height="13" rx="3" fill="rgba(255,255,255,0.5)"/>
        <text x="36" y="74" fill="white" fontSize="10.5" fontWeight="600" {...F}>Tableau de bord</text>

        {/* Autres nav */}
        {[
          ["Patients",        92],
          ["Consultations",   120],
          ["Rendez-vous",     148],
          ["Hospitalisation", 176],
          ["Laboratoire",     204],
          ["Pharmacie",       232],
          ["Utilisateurs",    260],
          ["Connexions",      288],
        ].map(([label, y]) => (
          <g key={label}>
            <rect x="18" y={y+3} width="13" height="13" rx="3" fill="rgba(255,255,255,0.22)"/>
            <text x="36" y={y+13} fill="rgba(255,255,255,0.62)" fontSize="10" {...F}>{label}</text>
          </g>
        ))}

        {/* Rôle footer */}
        <text x="12" y="556" fill="#f4b400" fontSize="8" fontWeight="700" letterSpacing="0.5" {...F}>ADMINISTRATEUR</text>
        <text x="12" y="568" fill="#6aa880" fontSize="8" {...F}>Plateforme EPS2 · v2.0</text>

        {/* ══════════════ TOPBAR ══════════════ */}
        <rect x="158" y="0" width="762" height="52" fill="white"/>
        <line x1="158" y1="51" x2="920" y2="51" stroke="#dde8e0" strokeWidth="1"/>

        {/* Titre page */}
        <text x="175" y="32" fill="#1d2a22" fontSize="14" fontWeight="700" {...F}>Tableau de bord</text>

        {/* Barre de recherche */}
        <rect x="298" y="13" width="200" height="26" rx="9" fill="#f2f7f3" stroke="#dde8e0" strokeWidth="1"/>
        <circle cx="313" cy="26" r="5.5" fill="none" stroke="#9db5a3" strokeWidth="1.4"/>
        <line x1="317" y1="30" x2="320" y2="33" stroke="#9db5a3" strokeWidth="1.4" strokeLinecap="round"/>
        <text x="328" y="30" fill="#9db5a3" fontSize="10.5" {...F}>Rechercher un patient…</text>

        {/* Badge RDV */}
        <rect x="508" y="13" width="136" height="26" rx="13" fill="#e3f3ea"/>
        <rect x="520" y="20" width="10" height="10" rx="2" fill="none" stroke="#1f8a55" strokeWidth="1.2"/>
        <line x1="523" y1="19" x2="523" y2="22" stroke="#1f8a55" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="527" y1="19" x2="527" y2="22" stroke="#1f8a55" strokeWidth="1.2" strokeLinecap="round"/>
        <text x="535" y="30" fill="#1f8a55" fontSize="10" fontWeight="600" {...F}>2 RDV aujourd'hui</text>

        {/* Nom utilisateur */}
        <text x="665" y="22" fill="#1d2a22" fontSize="10.5" fontWeight="600" {...F} textAnchor="end">Maodo Kante</text>
        {/* Badge rôle */}
        <rect x="596" y="26" width="70" height="14" rx="7" fill="#efe3c2"/>
        <text x="631" y="37" fill="#8a6a00" fontSize="8.5" fontWeight="700" {...F} textAnchor="middle">Administrateur</text>

        {/* Avatar MK */}
        <circle cx="680" cy="26" r="15" fill="#117a3d"/>
        <text x="680" y="31" fill="white" fontSize="10" fontWeight="700" {...F} textAnchor="middle">MK</text>

        {/* Bouton déconnexion */}
        <rect x="702" y="14" width="96" height="24" rx="7" fill="#f2f7f3" stroke="#dde8e0" strokeWidth="1"/>
        <text x="750" y="30" fill="#1d2a22" fontSize="10" fontWeight="600" {...F} textAnchor="middle">→ Déconnexion</text>

        {/* ══════════════ CONTENU ══════════════ */}

        {/* En-tête dashboard */}
        <text x="175" y="82" fill="#1d2a22" fontSize="17" fontWeight="800" {...F}>Bonjour, Maodo</text>
        <text x="175" y="97" fill={M} fontSize="10.5" {...F}>Jeudi 18 Juin 2026</text>

        {/* Badge live */}
        <rect x="760" y="68" width="138" height="22" rx="11" fill="#e3f3ea"/>
        <circle cx="773" cy="79" r="4" fill="#1f8a55"/>
        <text x="782" y="83" fill="#1f8a55" fontSize="9.5" fontWeight="600" {...F}>Données en temps réel</text>

        {/* ── KPI ligne 1 ── */}
        {kpi1.map(({ x, num, lbl, sub, iBg, bar, nC }) => (
          <g key={x}>
            <rect x={x}   y="110" width="178" height="92" rx="10" fill="white" stroke="#dde8e0" strokeWidth="0.8"/>
            <rect x={x}   y="196" width="178" height="3"  rx="1.5" fill={bar}/>
            {/* Icône */}
            <rect x={x+12} y="120" width="30" height="30" rx="8" fill={iBg}/>
            <rect x={x+18} y="128" width="18" height="14" rx="3" fill={bar} opacity="0.45"/>
            {/* Chiffre */}
            <text x={x+12} y="172" fill={nC} fontSize="28" fontWeight="800" {...F}>{num}</text>
            {/* Label */}
            <text x={x+12} y="186" fill={M} fontSize="9.5" {...F}>{lbl}</text>
            {sub && <text x={x+12} y="198" fill="#c0d0c5" fontSize="8.5" {...F}>{sub}</text>}
          </g>
        ))}

        {/* ── KPI ligne 2 ── */}
        {kpi2.map(({ x, num, lbl, sub, iBg, bar, nC }) => (
          <g key={x}>
            <rect x={x}   y="214" width="257" height="76" rx="10" fill="white" stroke="#dde8e0" strokeWidth="0.8"/>
            <rect x={x}   y="284" width="257" height="3"  rx="1.5" fill={bar}/>
            <rect x={x+12} y="223" width="26" height="26" rx="7" fill={iBg}/>
            <rect x={x+17} y="229" width="16" height="12" rx="2.5" fill={bar} opacity="0.4"/>
            <text x={x+12} y="268" fill={nC} fontSize="20" fontWeight="800" {...F}>{num}</text>
            <text x={x+12} y="280" fill={M} fontSize="9.5" {...F}>{lbl}</text>
            {sub && <text x={x+12} y="292" fill="#c0d0c5" fontSize="8.5" {...F}>{sub}</text>}
          </g>
        ))}

        {/* ── Graphique barres ── */}
        <rect x="172" y="304" width="455" height="234" rx="10" fill="white" stroke="#dde8e0" strokeWidth="0.8"/>
        <text x="188" y="323" fill="#1d2a22" fontSize="11.5" fontWeight="700" {...F}>Consultations par mois</text>
        <text x="188" y="337" fill={M} fontSize="9" {...F}>Évolution sur les 6 derniers mois</text>
        {/* Grille */}
        {[480, 460, 440, 418].map((y,i) => (
          <line key={i} x1="196" y1={y} x2="612" y2={y} stroke="#eef3ef" strokeWidth="0.8"/>
        ))}
        {/* Barres */}
        {bars.map((h,i) => (
          <rect key={i} x={204+i*66} y={500-h} width="42" height={h} rx="5" fill="#117a3d" opacity={0.65+i*0.055}/>
        ))}
        {/* Axe X */}
        <line x1="196" y1="500" x2="614" y2="500" stroke="#dde8e0" strokeWidth="0.8"/>
        {["Jan","Fév","Mar","Avr","Mai","Juin"].map((l,i) => (
          <text key={i} x={225+i*66} y="514" fill={M} fontSize="9" {...F} textAnchor="middle">{l}</text>
        ))}

        {/* ── Graphique camembert ── */}
        <rect x="641" y="304" width="257" height="234" rx="10" fill="white" stroke="#dde8e0" strokeWidth="0.8"/>
        <text x="657" y="323" fill="#1d2a22" fontSize="11.5" fontWeight="700" {...F}>Rendez-vous par statut</text>
        <text x="657" y="337" fill={M} fontSize="9" {...F}>Répartition globale</text>
        {/* Donut */}
        <path d="M769,418 L769,372 A46,46 0 0,1 809,441 Z" fill="#117a3d"/>
        <path d="M769,418 L809,441 A46,46 0 0,1 739,453 Z" fill="#f4b400"/>
        <path d="M769,418 L739,453 A46,46 0 0,1 769,372 Z" fill="#c0392b" opacity="0.75"/>
        <circle cx="769" cy="418" r="24" fill="white"/>
        {/* Légende */}
        <circle cx="657" cy="504" r="5" fill="#117a3d"/>
        <text x="666" y="508" fill={M} fontSize="9" {...F}>Planifié</text>
        <circle cx="710" cy="504" r="5" fill="#f4b400"/>
        <text x="719" y="508" fill={M} fontSize="9" {...F}>Honoré</text>
        <circle cx="759" cy="504" r="5" fill="#c0392b"/>
        <text x="768" y="508" fill={M} fontSize="9" {...F}>Annulé</text>
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
    { bg:"#efe3c2", color:"#8a6a00", Icon:Settings,    label:"Administrateur", perms:"Tous les modules · Gestion utilisateurs · Config" },
    { bg:"#e6f2ea", color:"#0c5c2e", Icon:Stethoscope, label:"Médecin",         perms:"Dossiers · Consultations · Hospit. · Labo · Pharma" },
    { bg:"#e2ecf6", color:"#2b5a8a", Icon:Users,        label:"Accueil",          perms:"Patients · Rendez-vous · Tableau de bord" },
  ];
  return (
    <div className="lp-roles-card">
      {roles.map(({ bg, color, Icon, label, perms }, i) => (
        <div className="lp-role-row" key={i}>
          <div className="lp-role-ico" style={{ background:bg, color }}>
            <Icon size={20} strokeWidth={1.7}/>
          </div>
          <div>
            <div className="lp-role-name" style={{ color }}>{label}</div>
            <div className="lp-role-perms">{perms}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Scroll to top ── */
function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      className="lp-scroll-top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Retour en haut"
    >
      <ArrowUp size={18} strokeWidth={2.5}/>
    </button>
  );
}

/* ══════════════════════════════════════════
   LANDING PAGE
══════════════════════════════════════════ */
export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("");
  const [dark, setDark] = useState(
    () => document.documentElement.getAttribute("data-theme") === "dark"
  );

  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("eps2_theme", next ? "dark" : "light");
  }

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
    const ids = ["features", "preview", "modules", "howto", "security", "faq"];
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
    { Icon: LayoutDashboard, name: "Tableau de bord",  desc: "KPIs et graphiques temps réel"   },
    { Icon: UserRound,       name: "Patients",          desc: "Dossiers, IPP, archivage"         },
    { Icon: Activity,        name: "Consultations",     desc: "Constantes vitales, historique"   },
    { Icon: Calendar,        name: "Rendez-vous",       desc: "Planning, calendrier, conflits"   },
    { Icon: Bed,             name: "Hospitalisation",   desc: "Admissions et séjours"            },
    { Icon: FlaskConical,    name: "Laboratoire",       desc: "Analyses et résultats"            },
    { Icon: Pill,            name: "Pharmacie",         desc: "Ordonnances et stock"             },
    { Icon: Users,           name: "Utilisateurs",      desc: "Comptes et permissions"           },
    { Icon: History,         name: "Connexions",        desc: "Journal d'audit des accès"        },
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
            {[["features","Fonctionnalités"],["preview","Aperçu"],["modules","Modules"],["howto","Prise en main"],["security","Sécurité"],["faq","FAQ"]].map(([id, label]) => (
              <a key={id} href={`#${id}`} className={activeSection === id ? "lp-nav-active" : ""}>{label}</a>
            ))}
          </nav>
          <button className="dark-toggle" onClick={toggleDark} title={dark ? "Mode clair" : "Mode sombre"}>
            {dark ? <SunIcon size={16} strokeWidth={1.8}/> : <Moon size={16} strokeWidth={1.8}/>}
          </button>
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
              <div className="lp-kpi"><span className="lp-kpi-n"><KpiCounter to={9}/></span><span className="lp-kpi-l">Modules</span></div>
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

      {/* ─── Chiffres clés ─── */}
      <div className="lp-stats-strip">
        {[
          { n:"9",    l:"Modules métier"             },
          { n:"3",    l:"Niveaux d'accès"            },
          { n:"100%", l:"Hébergement local"          },
          { n:"∞",    l:"Dossiers patients"          },
          { n:"24/7", l:"Disponibilité"              },
        ].map(({ n, l }) => (
          <div className="lp-stats-item" key={l}>
            <span className="lp-stats-num">{n}</span>
            <span className="lp-stats-lbl">{l}</span>
          </div>
        ))}
      </div>

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
          <div className="lp-mod-grid lp-mod-grid-3">
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

      {/* ─── Comment ça marche ─── */}
      <section className="lp-section lp-alt" id="howto">
        <div className="lp-wrap">
          <div className="lp-sec-head reveal">
            <span className="lp-tag">Prise en main</span>
            <h2 className="lp-sec-h2">Opérationnel en 3 étapes</h2>
            <p className="lp-sec-desc">Pas de formation longue. Le personnel est autonome dès la première connexion.</p>
          </div>
          <div className="lp-steps">
            {[
              { n:"01", Icon:CheckCircle, title:"Connexion sécurisée", desc:"L'administrateur crée votre compte avec le rôle adapté. Vous vous connectez avec vos identifiants personnels — accès immédiat à votre périmètre." },
              { n:"02", Icon:Layers,      title:"Gestion des dossiers", desc:"Créez ou consultez le dossier d'un patient en quelques secondes. Saisissez les consultations, constantes vitales, analyses et ordonnances." },
              { n:"03", Icon:TrendingUp,  title:"Pilotage en temps réel", desc:"Le tableau de bord agrège les KPIs de l'établissement automatiquement : activité, flux de RDV, stocks pharmacie, alertes laboratoire." },
            ].map(({ n, Icon, title, desc }, i) => (
              <div className="lp-step reveal" style={{ "--d": `${i * 0.12}s` }} key={n}>
                <div className="lp-step-num">{n}</div>
                <div className="lp-step-ico"><Icon size={24} strokeWidth={1.6}/></div>
                <h3 className="lp-step-title">{title}</h3>
                <p className="lp-step-desc">{desc}</p>
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
        <div className="lp-wrap lp-footer-grid">

          {/* Colonne 1 — Marque */}
          <div className="lp-footer-col lp-footer-col-brand">
            <div className="lp-footer-brand">
              <Logo size={32}/>
              <div>
                <div className="lp-footer-name">Dossier Patient EPS2</div>
                <div className="lp-footer-sub">Établissement Public de Santé de Niveau 2</div>
              </div>
            </div>
            <p className="lp-footer-about">
              Plateforme numérique de gestion du dossier patient, développée dans le cadre de la Stratégie Sénégal Numérique 2050.
            </p>
            <div className="lp-footer-flag-inline">
              <span style={{ background:"#00853F" }}/>
              <span style={{ background:"#FDEF42" }}/>
              <span style={{ background:"#E31B23" }}/>
              <span className="lp-footer-flag-label">République du Sénégal</span>
            </div>
          </div>

          {/* Colonne 2 — Modules */}
          <div className="lp-footer-col">
            <div className="lp-footer-col-title">Modules</div>
            {["Tableau de bord","Patients","Consultations","Rendez-vous","Hospitalisation","Laboratoire","Pharmacie","Connexions"].map(m => (
              <div key={m} className="lp-footer-link">{m}</div>
            ))}
          </div>


        </div>

        <div className="lp-footer-bottom">
          <div className="lp-wrap lp-footer-bottom-inner">
            <span>© {new Date().getFullYear()} — Dossier Patient EPS2 · République du Sénégal</span>
            <span>Prototype v2 · Données médicales protégées</span>
          </div>
        </div>

        <div className="lp-footer-flag">
          <span style={{ background:"#00853F" }}/>
          <span style={{ background:"#FDEF42" }}/>
          <span style={{ background:"#E31B23" }}/>
        </div>
      </footer>

      {/* ─── Scroll to top ─── */}
      <ScrollTop/>
    </div>
  );
}
