import { useParams, Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { DeviceStatusBadge, StatusBadge } from "@/components/StatusBadges";
import { Building2, ArrowLeft, Cpu, Users, Activity, MapPin, Mail, Phone, User, TrendingUp } from "lucide-react";
import { branches, devices, getBranchScans, getPatient, getDevice } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";
import { format } from "date-fns";

export default function BranchDetail() {
  const { id } = useParams();
  const branch = branches.find((b) => b.id === id);
  if (!branch) return <div>Branch not found</div>;

  const branchDevices = devices.filter((d) => d.branchId === branch.id);
  const branchScans = getBranchScans(branch.id);
  const recent = [...branchScans].sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp)).slice(0, 6);

  const trend = Array.from({ length: 7 }, (_, i) => ({
    day: format(new Date(Date.now() - (6 - i) * 86400000), "EEE"),
    scans: 30 + Math.floor(Math.random() * 20),
  }));

  const deviceUsage = branchDevices.map((d) => ({ name: d.id, scans: d.totalScans }));

  return (
    <>
      <Link to="/branches" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to branches
      </Link>

      <div className="card-elevated overflow-hidden mb-6">
        <div className="h-32 bg-gradient-hero relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_50%)]" />
        </div>
        <div className="p-6 -mt-12 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="h-20 w-20 rounded-2xl bg-card shadow-elevated flex items-center justify-center border-4 border-card">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight">{branch.name}</h1>
              <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-1"><MapPin className="h-3.5 w-3.5" />{branch.city}, {branch.state}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Edit Branch</Button>
              <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90"><TrendingUp className="h-4 w-4 mr-2" />Compare</Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border text-sm">
            <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Manager</p><p className="font-semibold">{branch.manager}</p></div></div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Contact</p><p className="font-semibold">{branch.contact}</p></div></div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Email</p><p className="font-semibold">{branch.email}</p></div></div>
            <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Performance</p><p className="font-semibold text-success">{branch.performance}%</p></div></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Devices" value={branch.deviceCount} icon={Cpu} variant="info" />
        <StatCard label="Total Patients" value={branch.totalPatients.toLocaleString()} icon={Users} variant="accent" />
        <StatCard label="Scans Today" value={branch.todayScans} icon={Activity} variant="success" />
        <StatCard label="Weekly Scans" value={branch.weeklyScans} icon={TrendingUp} variant="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="card-elevated p-5">
          <h3 className="font-semibold mb-4">7-Day Scan Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              <Line type="monotone" dataKey="scans" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: "hsl(var(--primary))", r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card-elevated p-5">
          <h3 className="font-semibold mb-4">Device Usage</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={deviceUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} cursor={{ fill: "hsl(var(--muted))" }} />
              <Bar dataKey="scans" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-elevated p-5">
          <h3 className="font-semibold mb-4">Connected Devices</h3>
          <div className="space-y-3">
            {branchDevices.map((d) => (
              <Link to={`/devices/${d.id}`} key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary-soft flex items-center justify-center"><Cpu className="h-5 w-5 text-primary" /></div>
                  <div>
                    <p className="font-semibold text-sm">{d.id} · {d.model}</p>
                    <p className="text-xs text-muted-foreground">{d.totalScans.toLocaleString()} scans · Tech: {d.technician}</p>
                  </div>
                </div>
                <DeviceStatusBadge status={d.status} />
              </Link>
            ))}
          </div>
        </div>

        <div className="card-elevated p-5">
          <h3 className="font-semibold mb-4">Recent Patient Scans</h3>
          <div className="space-y-2">
            {recent.map((s) => {
              const p = getPatient(s.patientId);
              return (
                <Link to={`/patients/${p.id}`} key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors">
                  <div className="h-9 w-9 rounded-full bg-gradient-accent text-accent-foreground flex items-center justify-center text-xs font-bold">{p.name.split(" ").map(n => n[0]).join("")}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">BMI {s.measurement.bmi} · Health {s.measurement.healthScore}</p>
                  </div>
                  <StatusBadge status={s.status} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
