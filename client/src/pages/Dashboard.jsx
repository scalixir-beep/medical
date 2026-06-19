import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Users, Activity, CalendarCheck, Calendar,
  Bed, FlaskConical, AlertTriangle, Clock,
} from "lucide-react";
import { api }      from "../api.js";
import { useAuth }  from "../auth.jsx";
import { can }      from "../perms.js";
import { fmtDate }  from "../utils.js";
import { SkeletonStat } from "../components/Skeleton.jsx";

const GREEN = "#117a3d", GOLD = "#f4b400", RED = "#c0392b", BLUE = "#2b6ca3", LIGHT = "#7fc39b";

const PALETTES = {
  green: { bg:"var(--chip)",      fg:"var(--green-dk)", bar:"var(--green)"    },
  gold:  { bg:"#f9efd7",          fg:"#8a5c00",         bar:"var(--gold)"     },
  blue:  { bg:"#e2ecf6",          fg:"#2b5a8a",         bar:"#2b6ca3"         },
  red:   { bg:"var(--red-bg)",    fg:"var(--red)",       bar:"var(--red)"      },
  amber: { bg:"var(--amber-bg)",  fg:"var(--amber)",     bar:"var(--amber)"    },
};

function StatCard({ Icon, num, lbl, sub = null, color = "green" }) {
  const C = PALETTES[color] || PALETTES.green;
  return (
    <div className="ds-card">
      <div className="ds-icon" style={{ background: C.bg, color: C.fg }}>
        <Icon size={22} strokeWidth={1.7}/>
      </div>
      <div className="ds-num" style={{ color: C.fg }}>{num ?? "—"}</div>
      <div className="ds-lbl">{lbl}</div>
      {sub && <div className="ds-sub">{sub}</div>}
      <div className="ds-bar" style={{ background: C.bar }}/>
    </div>
  );
}

const TOOLTIP_STYLE = {
  borderRadius: 10, border: "1px solid var(--border)",
  fontSize: 13, boxShadow: "0 4px 14px rgba(8,63,32,0.1)",
};


export default function Dashboard() {
  const { user } = useAuth();
  const [k,          setK]    = useState(null);
  const [recentCons, setRec]  = useState([]);

  useEffect(() => {
    api.get("/api/kpis").then(setK).catch(() => {});
    if (can(user, "consultations"))
      api.get("/api/consultations").then(d => setRec(d.slice(0, 5))).catch(() => {});
  }, []);

  if (!k) return (
    <div>
      <div className="ds-header">
        <div>
          <div style={{ width:200, height:22, borderRadius:6, marginBottom:8 }} className="sk"/>
          <div style={{ width:140, height:13, borderRadius:4 }} className="sk"/>
        </div>
      </div>
      <div className="ds-grid-4">
        {[1,2,3,4].map(i => <SkeletonStat key={i}/>)}
      </div>
      <div className="ds-grid-3">
        {[1,2,3].map(i => <SkeletonStat key={i}/>)}
      </div>
    </div>
  );

  const dateLabel = new Date().toLocaleDateString("fr-FR", {
    weekday:"long", day:"numeric", month:"long", year:"numeric",
  });

  const statutColors = { "Planifié": GREEN, "Honoré": GOLD, "Annulé": RED };

  return (
    <div>

      {/* ── En-tête contextuel ── */}
      <div className="ds-header">
        <div>
          <h1 className="ds-title">
            Bonjour, {user?.name?.split(" ")[0]}
          </h1>
          <p className="ds-date">
            {dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)}
          </p>
        </div>
        <div className="ds-live">
          <span className="ds-live-dot"/>
          Données en temps réel
        </div>
      </div>

      {/* ── KPIs principaux ── */}
      <div className="ds-grid-4">
        <StatCard Icon={Users}         num={k.totals.patients}              lbl="Patients enregistrés"      color="green" sub="Dossiers actifs"/>
        <StatCard Icon={Activity}      num={k.totals.consultations}         lbl="Consultations"             color="blue"  sub="Tous services confondus"/>
        <StatCard Icon={CalendarCheck} num={k.totals.rdvAujourdhui}         lbl="Rendez-vous aujourd'hui"   color="gold"/>
        <StatCard Icon={Calendar}      num={k.totals.rdvPlanifies}          lbl="RDV planifiés"             color="green"/>
      </div>

      {/* ── KPIs médicaux (admin + médecin) ── */}
      {can(user, "hospitalisation") && (
        <div className="ds-grid-3">
          <StatCard Icon={Bed}           num={k.totals.hospitalisationsEnCours} lbl="Patients hospitalisés"    color="blue"  sub="En cours de séjour"/>
          <StatCard Icon={FlaskConical}  num={k.totals.analysesEnAttente}       lbl="Analyses en attente"      color="amber"/>
          <StatCard
            Icon={AlertTriangle}
            num={k.totals.medicamentsAlerte}
            lbl="Alertes stock pharmacie"
            color={k.totals.medicamentsAlerte > 0 ? "red" : "green"}
            sub={k.totals.medicamentsAlerte > 0 ? "Rupture ou stock bas" : "Stocks suffisants"}
          />
        </div>
      )}

      {/* ── Graphiques principaux ── */}
      <div className="charts">

        <div className="card">
          <div className="card-head">
            <div>
              <div className="chart-title">Consultations par mois</div>
              <div className="chart-sub">Évolution sur les 6 derniers mois</div>
            </div>
            <span className="ds-chip">6 mois</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={k.consultationsParMois} margin={{ top:6, right:8, left:-18, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef3ef" vertical={false}/>
                <XAxis dataKey="label" tick={{ fontSize:12, fill:"#647a6c" }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:12, fill:"#647a6c" }} axisLine={false} tickLine={false} allowDecimals={false}/>
                <Tooltip cursor={{ fill:"#f2f7f3" }} contentStyle={TOOLTIP_STYLE}/>
                <Bar dataKey="total" name="Consultations" fill={GREEN} radius={[6,6,0,0]} maxBarSize={46}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="chart-title">Rendez-vous par statut</div>
              <div className="chart-sub">Répartition globale</div>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={k.rdvParStatut} dataKey="value" nameKey="name"
                  innerRadius={58} outerRadius={90} paddingAngle={3}>
                  {k.rdvParStatut.map((e,i) => <Cell key={i} fill={statutColors[e.name] || LIGHT}/>)}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE}/>
                <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize:13 }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ── Graphiques secondaires ── */}
      <div className="charts row2" style={{ marginTop:18 }}>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="chart-title">Répartition par sexe</div>
              <div className="chart-sub">Patients enregistrés</div>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie data={k.patientsParSexe} dataKey="value" nameKey="name" outerRadius={80} label>
                  <Cell fill={GOLD}/><Cell fill={GREEN}/>
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE}/>
                <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize:13 }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="chart-title">Patients par tranche d'âge</div>
              <div className="chart-sub">Répartition démographique</div>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={k.patientsParTranche} margin={{ top:6, right:8, left:-18, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef3ef" vertical={false}/>
                <XAxis dataKey="name" tick={{ fontSize:12, fill:"#647a6c" }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:12, fill:"#647a6c" }} axisLine={false} tickLine={false} allowDecimals={false}/>
                <Tooltip cursor={{ fill:"#f2f7f3" }} contentStyle={TOOLTIP_STYLE}/>
                <Bar dataKey="value" name="Patients" fill={BLUE} radius={[6,6,0,0]} maxBarSize={46}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ── Consultations récentes ── */}
      {can(user, "consultations") && recentCons.length > 0 && (
        <div className="card" style={{ marginTop:18 }}>
          <div className="card-head">
            <div>
              <div className="chart-title">Consultations récentes</div>
              <div className="chart-sub">Les 5 dernières enregistrées</div>
            </div>
            <span className="ds-chip ds-chip-live">
              <Clock size={11}/> Temps réel
            </span>
          </div>
          <div className="card-body" style={{ padding:0 }}>
            <table>
              <thead>
                <tr>
                  <th>Date</th><th>Patient</th><th>Motif</th>
                  <th>Diagnostic</th><th>Médecin</th>
                </tr>
              </thead>
              <tbody>
                {recentCons.map(c => (
                  <tr key={c.id}>
                    <td style={{ whiteSpace:"nowrap" }}>{fmtDate(c.date)}</td>
                    <td>
                      <span style={{ fontWeight:600 }}>{c.prenom} {c.nom}</span>
                      <span className="code" style={{ marginLeft:6 }}>{c.code}</span>
                    </td>
                    <td>{c.motif || "—"}</td>
                    <td>{c.diagnostic || "—"}</td>
                    <td style={{ color:"var(--muted)", fontSize:13 }}>{c.medecin || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
