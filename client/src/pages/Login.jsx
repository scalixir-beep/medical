import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { Logo, Sun } from "../components/Brand.jsx";
import { HealthIllustration } from "../components/HealthIllustration.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword]  = useState("admin");
  const [error, setError]        = useState("");
  const [loading, setLoading]    = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try { await login(username, password); navigate("/"); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="login-wrap">

      {/* ── Panneau hero gauche ── */}
      <div className="login-hero">
        <div className="login-hero-top">
          <div className="tag">République du Sénégal</div>
          <h2>La santé numérique au service des EPS2</h2>
          <p className="lead">
            Centralisez le dossier patient, fluidifiez le parcours de soins et fiabilisez les données médicales.
          </p>
        </div>

        {/* Illustration médicale centrale */}
        <HealthIllustration className="login-illus"/>

        <div className="login-hero-bot">
          <div className="flagbar">
            <span style={{ background:"#00853F" }}/>
            <span style={{ background:"#FDEF42" }}/>
            <span style={{ background:"#E31B23" }}/>
          </div>
          <p className="login-hero-caption">
            Plateforme officielle — EPS2 Sénégal
          </p>
        </div>

        <Sun size={100}/>
      </div>

      {/* ── Formulaire de connexion ── */}
      <div className="login-side">
        <form className="login-card" onSubmit={submit}>
          <div className="brand-row">
            <Logo size={44}/>
            <div><h1>Dossier Patient EPS2</h1></div>
          </div>
          <p className="sub">Connectez-vous pour accéder à la plateforme.</p>

          {error && <div className="error-msg">{error}</div>}

          <label className="field">
            <span>Identifiant</span>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
              autoComplete="username"
            />
          </label>
          <label className="field">
            <span>Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          <button className="btn" style={{ width:"100%" }} disabled={loading}>
            {loading ? "Connexion…" : "Se connecter"}
          </button>

          <div className="hint">
            <b>Comptes de démonstration</b><br/>
            Administrateur — <b>admin / admin</b><br/>
            Médecin — <b>medecin / medecin</b><br/>
            Utilisateur (accueil) — <b>user / user</b>
          </div>
        </form>
      </div>
    </div>
  );
}
