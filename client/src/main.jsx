import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth.jsx";
import { can } from "./perms.js";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Patients from "./pages/Patients.jsx";
import PatientDetail from "./pages/PatientDetail.jsx";
import Consultations from "./pages/Consultations.jsx";
import RendezVous from "./pages/RendezVous.jsx";
import Users from "./pages/Users.jsx";
import "./styles.css";

function Private({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/landing" replace />;
}

// Garde d'accès par permission : redirige vers l'accueil si non autorisé
function RoleRoute({ action, children }) {
  const { user } = useAuth();
  return can(user, action) ? children : <Navigate to="/" replace />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Private><Layout /></Private>}>
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="patients/:id" element={<PatientDetail />} />
            <Route path="consultations" element={<RoleRoute action="consultations"><Consultations /></RoleRoute>} />
            <Route path="rendez-vous" element={<RendezVous />} />
            <Route path="utilisateurs" element={<RoleRoute action="users"><Users /></RoleRoute>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
