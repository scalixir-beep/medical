import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { can, roleClass } from "../perms.js";
import { Logo } from "./Brand.jsx";
import {
  LayoutDashboard, UserRound, Activity,
  Calendar, Users, LogOut,
} from "lucide-react";

const TITLES = {
  "/": "Tableau de bord",
  "/patients": "Patients",
  "/consultations": "Consultations",
  "/rendez-vous": "Rendez-vous",
  "/utilisateurs": "Utilisateurs",
};

export default function Layout() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const title    = TITLES[pathname] || (pathname.startsWith("/patients/") ? "Dossier patient" : "EPS2");
  const initials = (user?.name || "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

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

          {can(user, "users") && (
            <NavLink to="/utilisateurs">
              <span className="ico"><Users size={18} strokeWidth={1.7}/></span>
              <span className="txt">Utilisateurs</span>
            </NavLink>
          )}
        </nav>

        <div className="foot">Plateforme EPS2 · v2.0</div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="page-title">{title}</div>
          <div className="user-box">
            <div className="who">
              <div className="name">{user?.name}</div>
              <span className={`role-badge ${roleClass(user?.role)}`}>{user?.role}</span>
            </div>
            <div className="avatar">{initials}</div>
            <button className="btn ghost sm logout-btn" onClick={logout}>
              <LogOut size={14} strokeWidth={2}/> Déconnexion
            </button>
          </div>
        </header>
        <main className="content"><Outlet/></main>
      </div>
    </div>
  );
}
