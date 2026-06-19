import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../auth.jsx";
import { can, roleClass } from "../perms.js";
import { Logo } from "./Brand.jsx";
import { GlobalSearch } from "./GlobalSearch.jsx";
import { api } from "../api.js";
import {
  LayoutDashboard, UserRound, Activity, Calendar,
  Bed, FlaskConical, Pill, Users, LogOut, History,
  Sun, Moon,
} from "lucide-react";

const TITLES = {
  "/":               "Tableau de bord",
  "/patients":       "Patients",
  "/consultations":  "Consultations",
  "/rendez-vous":    "Rendez-vous",
  "/hospitalisation":"Hospitalisation",
  "/laboratoire":    "Laboratoire",
  "/pharmacie":      "Pharmacie",
  "/utilisateurs":   "Utilisateurs",
  "/connexions":     "Historique des connexions",
};

export default function Layout() {
  const { user, logout }  = useAuth();
  const { pathname }      = useLocation();
  const navigate          = useNavigate();
  const [rdvToday, setRdvToday] = useState(0);
  const [dark,     setDark]     = useState(
    () => document.documentElement.getAttribute("data-theme") === "dark"
  );

  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("eps2_theme", next ? "dark" : "light");
  }

  const title    = TITLES[pathname] || (pathname.startsWith("/patients/") ? "Dossier patient" : "EPS2");
  const initials = (user?.name || "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  useEffect(() => {
    api.get("/api/kpis").then(k => setRdvToday(k.totals.rdvAujourdhui)).catch(() => {});
  }, []);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <Logo size={36}/>
          <div>Dossier Patient<small>EPS2 · Sénégal</small></div>
        </div>

        <nav className="nav">
          <NavLink to="/" end>
            <span className="ico"><LayoutDashboard size={18} strokeWidth={1.7}/></span>
            <span className="txt">Tableau de bord</span>
          </NavLink>

          <NavLink to="/patients">
            <span className="ico"><UserRound size={18} strokeWidth={1.7}/></span>
            <span className="txt">Patients</span>
          </NavLink>

          {can(user, "consultations") && (
            <NavLink to="/consultations">
              <span className="ico"><Activity size={18} strokeWidth={1.7}/></span>
              <span className="txt">Consultations</span>
            </NavLink>
          )}

          <NavLink to="/rendez-vous">
            <span className="ico"><Calendar size={18} strokeWidth={1.7}/></span>
            <span className="txt">Rendez-vous</span>
          </NavLink>

          {can(user, "hospitalisation") && (
            <NavLink to="/hospitalisation">
              <span className="ico"><Bed size={18} strokeWidth={1.7}/></span>
              <span className="txt">Hospitalisation</span>
            </NavLink>
          )}

          {can(user, "laboratoire") && (
            <NavLink to="/laboratoire">
              <span className="ico"><FlaskConical size={18} strokeWidth={1.7}/></span>
              <span className="txt">
                Laboratoire
                {/* badge rôle spécifique */}
                {user?.role === "Biologiste" && <span className="nav-role-tag">Résultats</span>}
              </span>
            </NavLink>
          )}

          {can(user, "pharmacie") && (
            <NavLink to="/pharmacie">
              <span className="ico"><Pill size={18} strokeWidth={1.7}/></span>
              <span className="txt">
                Pharmacie
                {user?.role === "Pharmacien" && <span className="nav-role-tag">Stock</span>}
              </span>
            </NavLink>
          )}

          {can(user, "users") && (
            <NavLink to="/utilisateurs">
              <span className="ico"><Users size={18} strokeWidth={1.7}/></span>
              <span className="txt">Utilisateurs</span>
            </NavLink>
          )}
          {can(user, "connexions") && (
            <NavLink to="/connexions">
              <span className="ico"><History size={18} strokeWidth={1.7}/></span>
              <span className="txt">Connexions</span>
            </NavLink>
          )}
        </nav>

        <div className="foot">
          <div className="foot-role">{user?.role}</div>
          <div>Plateforme EPS2 · v2.0</div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="page-title">{title}</div>
          <GlobalSearch/>
          <button className="dark-toggle" onClick={toggleDark} title={dark ? "Mode clair" : "Mode sombre"}>
            {dark ? <Sun size={16} strokeWidth={1.8}/> : <Moon size={16} strokeWidth={1.8}/>}
          </button>
          {rdvToday > 0 && (
            <button className="rdv-today-badge" onClick={() => navigate("/rendez-vous")}>
              <Calendar size={14} strokeWidth={2}/>
              {rdvToday} RDV aujourd'hui
            </button>
          )}
          <div className="user-box">
            <div className="who">
              <div className="name">{user?.name}</div>
              <span className={`role-badge ${roleClass(user?.role)}`}>{user?.role}</span>
            </div>
            <div className="avatar">{initials}</div>
            <button className="btn ghost sm logout-btn" onClick={logout}>
              <LogOut size={14} strokeWidth={2}/> <span>Déconnexion</span>
            </button>
          </div>
        </header>
        <main className="content"><Outlet/></main>
      </div>
    </div>
  );
}
