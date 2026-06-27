import { createContext, useContext, useState } from "react";
import { api, setToken, clearToken } from "./api.js";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("eps2_user")); }
    catch { return null; }
  });

  async function login(username, password) {
    const data = await api.post("/api/login", { username, password });
    setToken(data.token);
    localStorage.setItem("eps2_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  function loginWithToken(token, userData) {
    setToken(token);
    localStorage.setItem("eps2_user", JSON.stringify(userData));
    setUser(userData);
  }

  function logout() {
    clearToken();
    localStorage.removeItem("eps2_user");
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ user, login, loginWithToken, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() { return useContext(AuthCtx); }
