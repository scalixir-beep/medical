import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";

const GREEN = "#117a3d", GOLD = "#f4b400", RED = "#c0392b", BLUE = "#2b6ca3", LIGHT = "#7fc39b";

export default function Dashboard() {
  const { user } = useAuth();
  const [k, setK] = useState(null);

  useEffect(() => { api.get("/api/kpis").then(setK).catch(() => {}); }, []);
  if (!k) return <div className="empty">Chargement des indicateurs…</div>;

  const cards = [
    { ico: "👥", num: k.totals.patients, lbl: "Patients enregistrés" },
    { ico: "🩺", num: k.totals.consultations, lbl: "Consultations" },
    { ico: "📅", num: k.totals.rdvAujourdhui, lbl: "Rendez-vous aujourd'hui", gold: true },
    { ico: "🗓️", num: k.totals.rdvPlanifies, lbl: "Rendez-vous planifiés" },
  ];

  const statutColors = { "Planifié": GREEN, "Honoré": GOLD, "Annulé": RED };

  return (
    <div>
      <div className="page-head">
        <h1>Bonjour, {user?.name?.split(" ")[0]} 👋</h1>
        <p>Vue d'ensemble de l'activité de l'établissement.</p>
      </div>

      <div className="stats">
        {cards.map((c, i) => (
          <div className={`stat ${c.gold ? "gold" : ""}`} key={i}>
            <div className="ico">{c.ico}</div>
            <div className="num">{c.num}</div>
            <div className="lbl">{c.lbl}</div>
          </div>
        ))}
      </div>

      <div className="charts">
        <div className="card"><div className="card-body">
          <div className="chart-title">Consultations par mois</div>
          <div className="chart-sub">Évolution sur les 6 derniers mois</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={k.consultationsParMois} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef3ef" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#647a6c" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#647a6c" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip cursor={{ fill: "#f2f7f3" }} />
              <Bar dataKey="total" name="Consultations" fill={GREEN} radius={[6, 6, 0, 0]} maxBarSize={46} />
            </BarChart>
          </ResponsiveContainer>
        </div></div>

        <div className="card"><div className="card-body">
          <div className="chart-title">Rendez-vous par statut</div>
          <div className="chart-sub">Répartition de tous les rendez-vous</div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={k.rdvParStatut} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {k.rdvParStatut.map((e, i) => <Cell key={i} fill={statutColors[e.name] || LIGHT} />)}
              </Pie>
              <Tooltip /><Legend iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div></div>
      </div>

      <div className="charts row2">
        <div className="card"><div className="card-body">
          <div className="chart-title">Répartition par sexe</div>
          <div className="chart-sub">Patients enregistrés</div>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={k.patientsParSexe} dataKey="value" nameKey="name" outerRadius={85} label>
                <Cell fill={GOLD} /><Cell fill={GREEN} />
              </Pie>
              <Tooltip /><Legend iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div></div>

        <div className="card"><div className="card-body">
          <div className="chart-title">Patients par tranche d'âge</div>
          <div className="chart-sub">Répartition démographique</div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={k.patientsParTranche} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef3ef" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#647a6c" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#647a6c" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip cursor={{ fill: "#f2f7f3" }} />
              <Bar dataKey="value" name="Patients" fill={BLUE} radius={[6, 6, 0, 0]} maxBarSize={46} />
            </BarChart>
          </ResponsiveContainer>
        </div></div>
      </div>
    </div>
  );
}
