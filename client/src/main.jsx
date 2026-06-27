import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth.jsx";
import { can } from "./perms.js";
import Layout         from "./components/Layout.jsx";
import { ToastProvider } from "./components/Toast.jsx";
import Landing        from "./pages/Landing.jsx";
import Login          from "./pages/Login.jsx";
import Dashboard      from "./pages/Dashboard.jsx";
import Patients       from "./pages/Patients.jsx";
import PatientDetail  from "./pages/PatientDetail.jsx";
import Consultations  from "./pages/Consultations.jsx";
import RendezVous     from "./pages/RendezVous.jsx";
import Hospitalisation from "./pages/Hospitalisation.jsx";
import Laboratoire    from "./pages/Laboratoire.jsx";
import Pharmacie      from "./pages/Pharmacie.jsx";
import Users            from "./pages/Users.jsx";
import ConnexionLog     from "./pages/ConnexionLog.jsx";
import PrintDossier     from "./pages/PrintDossier.jsx";
import PrintOrdonnance  from "./pages/PrintOrdonnance.jsx";
import "./styles.css";

function Private({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/landing" replace />;
}

function RoleRoute({ action, children }) {
  const { user } = useAuth();
  return can(user, action) ? children : <Navigate to="/" replace />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/landing" element={<Landing />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/" element={<Private><Layout /></Private>}>
            <Route index element={<Dashboard />} />
            <Route path="patients"        element={<Patients />} />
            <Route path="patients/:id"    element={<PatientDetail />} />
            <Route path="consultations"   element={<RoleRoute action="consultations"><Consultations /></RoleRoute>} />
            <Route path="rendez-vous"     element={<RendezVous />} />
            <Route path="hospitalisation" element={<RoleRoute action="hospitalisation"><Hospitalisation /></RoleRoute>} />
            <Route path="laboratoire"     element={<RoleRoute action="laboratoire"><Laboratoire /></RoleRoute>} />
            <Route path="pharmacie"       element={<RoleRoute action="pharmacie"><Pharmacie /></RoleRoute>} />
            <Route path="utilisateurs"    element={<RoleRoute action="users"><Users /></RoleRoute>} />
          <Route path="connexions"      element={<RoleRoute action="connexions"><ConnexionLog /></RoleRoute>} />
          </Route>
          {/* Pages d'impression — hors Layout (pas de nav) */}
          <Route path="/patients/:id/imprimer"      element={<Private><PrintDossier /></Private>} />
          <Route path="/ordonnances/:id/imprimer"   element={<Private><PrintOrdonnance /></Private>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ToastProvider>
  </React.StrictMode>
);
