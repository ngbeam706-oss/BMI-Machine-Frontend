import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { StatusBadge, DeviceStatusBadge } from "@/components/StatusBadges";
import { Building2, Cpu, Users, Activity, CalendarDays, Wifi, WifiOff, AlertTriangle, ArrowRight } from "lucide-react";
import { branches, devices, patients, scans, totalsAcrossBranches, getPatient, getBranch, getDevice } from "@/data/mockData";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const trendData = Array.from({ length: 14 }, (_, i) => ({
  day: format(new Date(Date.now() - (13 - i) * 86400000), "d MMM"),
  scans: 120 + Math.floor(Math.random() * 80) + i * 4,
  abnormal: 12 + Math.floor(Math.random() * 14),
}));

const branchScanData = branches.map((b) => ({
  name: b.name.replace("Mayurah ", ""),
  scans: b.weeklyScans,
}));

const compositionData = [
  { name: "Normal", value: scans.filter((s) => s.status === "Normal").length, color: "hsl(var(--success))" },
  { name: "Attention", value: scans.filter((s) => s.status === "Attention").length, color: "hsl(var(--warning))" },
  { name: "Critical", value: scans.filter((s) => s.status === "Critical").length, color: "hsl(var(--destructive))" },
];

const recentScans = [...scans].sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp)).slice(0, 6);
const alerts = scans.filter((s) => s.status === "Critical").slice(0, 4);

export default function Dashboard() {
  return (
    <>
      <PageHeader title="Operations Dashboard" description="Real-time visibility across all Mayurah Hospitals branches">
        <Select defaultValue="all">
          <SelectTrigger className="w-40 bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select defaultValue="7d">
          <SelectTrigger className="w-32 bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">Today</SelectItem>
            <SelectItem value="7d">7 days</SelectItem>
            <SelectItem value="30d">30 days</SelectItem>
            <SelectItem value="90d">90 days</SelectItem>
          </SelectContent>
        </Select>
        <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
          <CalendarDays className="h-4 w-4 mr-2" />
          Schedule Report
        </Button>
      </PageHeader>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Branches" value={totalsAcrossBranches.branches} icon={Building2} variant="primary" trend={4.2} trendLabel="vs last quarter" />
        <StatCard label="Connected Devices" value={totalsAcrossBranches.devices} icon={Cpu} variant="info" trend={8.1} trendLabel="vs last month" />
        <StatCard label="Patients Measured" value={totalsAcrossBranches.patients.toLocaleString()} icon={Users} variant="accent" trend={12.6} trendLabel="this month" />
        <StatCard label="Scans Today" value={totalsAcrossBranches.scansToday} icon={Activity} variant="success" trend={3.4} trendLabel="vs yesterday" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Weekly Scans" value={totalsAcrossBranches.scansWeek} icon={CalendarDays} variant="primary" />
        <StatCard label="Active Devices" value={totalsAcrossBranches.activeDevices} icon={Wifi} variant="success" />
        <StatCard label="Inactive Devices" value={totalsAcrossBranches.inactiveDevices} icon={WifiOff} variant="warning" />
        <StatCard label="Critical Alerts" value={alerts.length} icon={AlertTriangle} variant="warning" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="card-elevated p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Scan Volume Trend</h3>
              <p className="text-xs text-muted-foreground">Last 14 days · all branches</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Total scans</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning" /> Abnormal</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--warning))" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, boxShadow: "var(--shadow-card)" }} />
              <Area type="monotone" dataKey="scans" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#g1)" />
              <Area type="monotone" dataKey="abnormal" stroke="hsl(var(--warning))" strokeWidth={2} fill="url(#g2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card-elevated p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-foreground">Report Status</h3>
            <p className="text-xs text-muted-foreground">All scans this period</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={compositionData} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {compositionData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {compositionData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} /> {d.name}</span>
                <span className="font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="card-elevated p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Branch-wise Scans (Weekly)</h3>
            <Link to="/branches" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={branchScanData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} angle={-15} height={50} textAnchor="end" />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} cursor={{ fill: "hsl(var(--muted))" }} />
              <Bar dataKey="scans" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-elevated p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Critical Alerts</h3>
            <Link to="/alerts" className="text-xs font-semibold text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {alerts.map((s) => {
              const p = getPatient(s.patientId);
              const b = getBranch(s.branchId);
              return (
                <Link to={`/patients/${p.id}`} key={s.id} className="flex items-start gap-3 p-3 rounded-xl bg-destructive/5 border border-destructive/15 hover:bg-destructive/10 transition-colors">
                  <div className="h-9 w-9 rounded-lg bg-destructive/15 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{b.city} · BMI {s.measurement.bmi} · Visceral {s.measurement.visceralFat}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent scans */}
      <div className="card-elevated overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground">Recent Patient Scans</h3>
            <p className="text-xs text-muted-foreground">Latest measurements across all branches & devices</p>
          </div>
          <Link to="/patients"><Button variant="outline" size="sm">View all patients <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground tracking-wider">
              <tr>
                <th className="text-left font-semibold py-3 px-5">Patient</th>
                <th className="text-left font-semibold py-3 px-5">Branch</th>
                <th className="text-left font-semibold py-3 px-5">Device</th>
                <th className="text-left font-semibold py-3 px-5">When</th>
                <th className="text-left font-semibold py-3 px-5">BMI</th>
                <th className="text-left font-semibold py-3 px-5">Health</th>
                <th className="text-left font-semibold py-3 px-5">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentScans.map((s) => {
                const p = getPatient(s.patientId);
                const b = getBranch(s.branchId);
                const d = getDevice(s.deviceId);
                return (
                  <tr key={s.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-5">
                      <Link to={`/patients/${p.id}`} className="flex items-center gap-3 group">
                        <div className="h-9 w-9 rounded-full bg-gradient-accent text-accent-foreground flex items-center justify-center text-xs font-bold">{p.name.split(" ").map(n => n[0]).join("")}</div>
                        <div>
                          <p className="font-semibold group-hover:text-primary transition-colors">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.id} · {p.gender} · {p.age}y</p>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 px-5"><span className="text-sm">{b.name.replace("Mayurah ", "")}</span></td>
                    <td className="py-3 px-5"><span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{d.id}</span></td>
                    <td className="py-3 px-5 text-muted-foreground text-xs">{format(new Date(s.timestamp), "d MMM, HH:mm")}</td>
                    <td className="py-3 px-5 font-semibold">{s.measurement.bmi}</td>
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-primary" style={{ width: `${s.measurement.healthScore}%` }} />
                        </div>
                        <span className="text-xs font-semibold">{s.measurement.healthScore}</span>
                      </div>
                    </td>
                    <td className="py-3 px-5"><StatusBadge status={s.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
