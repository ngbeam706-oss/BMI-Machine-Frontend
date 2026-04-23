import { PageHeader } from "@/components/PageHeader";
import { scans, getPatient, getBranch, getDevice } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadges";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Download, FileBarChart2 } from "lucide-react";

export default function Reports() {
  const recent = [...scans].sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp)).slice(0, 30);
  return (
    <>
      <PageHeader title="Reports" description="All body composition reports across branches">
        <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export CSV</Button>
      </PageHeader>
      <div className="card-elevated overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground tracking-wider">
            <tr>
              <th className="text-left font-semibold py-3 px-5">Report</th>
              <th className="text-left font-semibold py-3 px-5">Patient</th>
              <th className="text-left font-semibold py-3 px-5">Branch / Device</th>
              <th className="text-left font-semibold py-3 px-5">Date</th>
              <th className="text-left font-semibold py-3 px-5">BMI</th>
              <th className="text-left font-semibold py-3 px-5">Health</th>
              <th className="text-left font-semibold py-3 px-5">Status</th>
              <th className="text-left font-semibold py-3 px-5"></th>
            </tr>
          </thead>
          <tbody>
            {recent.map((s) => {
              const p = getPatient(s.patientId);
              const b = getBranch(s.branchId);
              const d = getDevice(s.deviceId);
              return (
                <tr key={s.id} className="border-t border-border hover:bg-muted/30">
                  <td className="py-3 px-5"><span className="font-mono text-xs bg-muted px-2 py-1 rounded">{s.id}</span></td>
                  <td className="py-3 px-5"><Link to={`/patients/${p.id}`} className="font-semibold hover:text-primary">{p.name}</Link></td>
                  <td className="py-3 px-5 text-xs">{b.name.replace("Mayurah ", "")} · {d.id}</td>
                  <td className="py-3 px-5 text-xs text-muted-foreground">{format(new Date(s.timestamp), "d MMM yyyy, HH:mm")}</td>
                  <td className="py-3 px-5 font-semibold">{s.measurement.bmi}</td>
                  <td className="py-3 px-5 font-semibold">{s.measurement.healthScore}</td>
                  <td className="py-3 px-5"><StatusBadge status={s.status} /></td>
                  <td className="py-3 px-5"><Link to={`/patients/${p.id}`}><Button variant="ghost" size="sm"><FileBarChart2 className="h-4 w-4 mr-1" />View</Button></Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
