import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { api } from "../api.js";
import { Logo, Sun } from "../components/Brand.jsx";
import { HealthIllustration } from "../components/HealthIllustration.jsx";

const GOOGLE_API_URL = "http://localhost:8000/auth/google/redirect";
const ROLES = ["Médecin", "Infirmier", "Accueil", "Pharmacien", "Biologiste"];

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

export default function Login() {
  const { login, loginWithToken } = useAuth();
  const navigate = useNavigate();

  const [mode,     setMode]     = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState("");
  const [role,     setRole]     = useState("Accueil");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  function switchMode(m) {
    setMode(m); setError("");
    setUsername(""); setPassword(""); setName(""); setRole("Accueil");
  }

  /* Réception token Google après callback */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const token  = p.get("token");
    const userB64 = p.get("user");
    if (p.get("error")) {
      setError("Connexion Google échouée. Réessayez.");
      window.history.replaceState({}, "", "/login");
      return;
    }
    if (token && userB64) {
      try {
        loginWithToken(token, JSON.parse(atob(userB64)));
        navigate("/");
      } catch { setError("Erreur lors de la connexion Google."); }
      window.history.replaceState({}, "", "/login");
    }
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (mode === "login") {
        await login(username, password);
      } else {
        const data = await api.post("/api/register", { username, password, name, role });
        loginWithToken(data.token, data.user);
      }
      navigate("/");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="login-wrap">

      {/* ── Panneau hero gauche ── */}
      <div className="login-hero">
        <div className="login-hero-top">
          <div className="tag">République du Sénégal · EPS2</div>
          <h2>CHR El Hadji Ahmadou Sakhir Ndiéguène de Thiès</h2>
          <p className="lead">
            Plateforme numérique de gestion du Dossier Patient Informatisé — centralisez les soins, fluidifiez le parcours patient et fiabilisez les données médicales du CHRASNT.
          </p>
        </div>

        <HealthIllustration className="login-illus"/>

        <div className="login-hero-bot">
          <div className="flagbar">
            <span style={{ background:"#00853F" }}/>
            <span style={{ background:"#FDEF42" }}/>
            <span style={{ background:"#E31B23" }}/>
          </div>
          <p className="login-hero-caption">
            CHRASNT · Avenue Malick Sy, Thiès · EPS2
          </p>
        </div>

        <Sun size={100}/>
      </div>

      {/* ── Formulaire connexion / inscription ── */}
      <div className="login-side">
        <form className="login-card" onSubmit={submit}>
          <div className="brand-row">
            <Logo size={44}/>
            <div>
              <h1>Dossier Patient · CHRASNT</h1>
              <p className="sub">Centre Hospitalier Régional de Thiès</p>
            </div>
          </div>

          {error && <div className="error-msg">{error}</div>}

          {/* Google — connexion uniquement */}
          {mode === "login" && (
            <>
              <a href={GOOGLE_API_URL} className="btn-google">
                <GoogleIcon/>
                Se connecter avec Google
              </a>
              <div className="divider-or"><span>ou</span></div>
            </>
          )}

          {/* Champs inscription */}
          {mode === "register" && (
            <>
              <label className="field">
                <span>Nom complet</span>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="Ex : Moussa Diallo" required autoFocus/>
              </label>
              <label className="field">
                <span>Rôle</span>
                <select value={role} onChange={e => setRole(e.target.value)}>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </label>
            </>
          )}

          <label className="field">
            <span>Identifiant</span>
            <input value={username} onChange={e => setUsername(e.target.value)}
              autoFocus={mode === "login"} autoComplete="username" required/>
          </label>
          <label className="field">
            <span>Mot de passe</span>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"} required/>
          </label>

          <button className="btn" style={{ width:"100%" }} disabled={loading}>
            {loading
              ? (mode === "login" ? "Connexion…" : "Inscription…")
              : (mode === "login" ? "Se connecter" : "Créer mon compte")}
          </button>

          <p className="login-switch">
            {mode === "login" ? (
              <>Vous n'avez pas de compte ?{" "}
                <button type="button" onClick={() => switchMode("register")}>S'inscrire</button>
              </>
            ) : (
              <>Vous avez déjà un compte ?{" "}
                <button type="button" onClick={() => switchMode("login")}>Se connecter</button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
