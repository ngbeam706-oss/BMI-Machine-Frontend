import { useParams, Link } from "react-router-dom";
import { devices, getBranch, getDeviceScans, getPatient } from "@/data/mockData";
import { ArrowLeft, Cpu, Activity, Wifi, AlertTriangle, RefreshCw } from "lucide-react";
import { DeviceStatusBadge, StatusBadge } from "@/components/StatusBadges";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { format, formatDistanceToNow } from "date-fns";

export default function DeviceDetail() {
  const { id } = useParams();
  const device = devices.find((d) => d.id === id);
  if (!device) return <div>Not found</div>;

  const branch = getBranch(device.branchId);
  const deviceScans = getDeviceScans(device.id).slice(0, 10);
  const isOffline = device.status === "Offline";

  return (
    <>
      <Link to="/devices" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to devices
      </Link>

      {isOffline && (
        <div className="card-elevated p-4 mb-4 border-destructive/30 bg-destructive/5 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <div className="flex-1">
            <p className="font-semibold text-destructive">Device is currently offline</p>
            <p className="text-xs text-muted-foreground">Last sync was {formatDistanceToNow(new Date(device.lastSync), { addSuffix: true })}. Please contact technician.</p>
          </div>
          <Button variant="outline" size="sm"><RefreshCw className="h-3 w-3 mr-1" />Re-sync</Button>
        </div>
      )}

      <div className="card-elevated p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Cpu className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{device.id}</h1>
              <p className="text-muted-foreground">{device.model} · Serial {device.serial} · Firmware {device.firmware}</p>
              <p className="text-xs text-muted-foreground mt-1">Branch: <Link to={`/branches/${branch.id}`} className="text-primary hover:underline font-semibold">{branch.name}</Link></p>
            </div>
          </div>
          <DeviceStatusBadge status={device.status} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Scans" value={device.totalScans.toLocaleString()} icon={Activity} variant="primary" />
        <StatCard label="Uptime" value={`${device.uptime}%`} icon={Wifi} variant="success" />
        <StatCard label="Last Sync" value={formatDistanceToNow(new Date(device.lastSync), { addSuffix: false })} icon={RefreshCw} variant="info" />
        <StatCard label="Recent Scans" value={deviceScans.length} icon={Activity} variant="accent" />
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold">Scan History</h3>
          <p className="text-xs text-muted-foreground">Last measurements uploaded by this device</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground tracking-wider">
            <tr>
              <th className="text-left font-semibold py-3 px-5">Patient</th>
              <th className="text-left font-semibold py-3 px-5">When</th>
              <th className="text-left font-semibold py-3 px-5">Weight</th>
              <th className="text-left font-semibold py-3 px-5">BMI</th>
              <th className="text-left font-semibold py-3 px-5">Status</th>
            </tr>
          </thead>
          <tbody>
            {deviceScans.map((s) => {
              const p = getPatient(s.patientId);
              return (
                <tr key={s.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-5"><Link to={`/patients/${p.id}`} className="font-semibold hover:text-primary">{p.name}</Link><p className="text-xs text-muted-foreground">{p.id}</p></td>
                  <td className="py-3 px-5 text-xs text-muted-foreground">{format(new Date(s.timestamp), "d MMM yyyy, HH:mm")}</td>
                  <td className="py-3 px-5 font-semibold">{s.measurement.weight} kg</td>
                  <td className="py-3 px-5 font-semibold">{s.measurement.bmi}</td>
                  <td className="py-3 px-5"><StatusBadge status={s.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
