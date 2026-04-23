import { PageHeader } from "@/components/PageHeader";
import { branches, devices, scans } from "@/data/mockData";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { format } from "date-fns";

export default function Analytics() {
  const branchData = branches.map((b) => ({ name: b.name.replace("Mayurah ", "").slice(0, 14), scans: b.weeklyScans, performance: b.performance }));
  const trend = Array.from({ length: 30 }, (_, i) => ({
    day: format(new Date(Date.now() - (29 - i) * 86400000), "d MMM"),
    scans: 100 + Math.floor(Math.random() * 90) + i * 2,
  }));
  const genderSplit = [
    { name: "Male", value: 32, color: "hsl(var(--primary))" },
    { name: "Female", value: 32, color: "hsl(var(--accent))" },
  ];
  const deviceModels = devices.reduce<Record<string, number>>((acc, d) => { acc[d.model] = (acc[d.model] ?? 0) + 1; return acc; }, {});
  const modelData = Object.entries(deviceModels).map(([name, value]) => ({ name, value }));

  return (
    <>
      <PageHeader title="Analytics" description="Cross-branch insights & operational performance" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="card-elevated p-5">
          <h3 className="font-bold mb-4">30-Day Scan Volume</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} /><stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} interval={3} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              <Area type="monotone" dataKey="scans" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#ag)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card-elevated p-5">
          <h3 className="font-bold mb-4">Branch Performance</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={branchData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} angle={-20} height={60} textAnchor="end" />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} cursor={{ fill: "hsl(var(--muted))" }} />
              <Bar dataKey="scans" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-elevated p-5">
          <h3 className="font-bold mb-4">Patient Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={genderSplit} dataKey="value" innerRadius={50} outerRadius={90} paddingAngle={3}>
                {genderSplit.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card-elevated p-5">
          <h3 className="font-bold mb-4">Device Models in Network</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={modelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={120} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} cursor={{ fill: "hsl(var(--muted))" }} />
              <Bar dataKey="value" fill="hsl(var(--info))" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
