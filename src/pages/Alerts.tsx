import { PageHeader } from "@/components/PageHeader";
import { scans, getPatient, getBranch } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadges";
import { AlertTriangle, AlertCircle, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { usePagination } from "@/hooks/usePagination";
import { DataTablePagination } from "@/components/DataTablePagination";

export default function Alerts() {
  const critical = scans.filter((s) => s.status === "Critical");
  const allAttention = scans.filter((s) => s.status === "Attention");

  const {
    paginatedItems: attention,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    pageSize
  } = usePagination(allAttention, 10);

  return (
    <>
      <PageHeader title="Clinical Alerts" description={`${critical.length} critical · ${totalItems} attention items`} />

      <div className="card-elevated overflow-hidden mb-6">
        <div className="p-5 border-b border-border bg-destructive/5 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h3 className="font-bold text-destructive">Critical — Immediate review required</h3>
        </div>
        <div className="divide-y divide-border">
          {critical.map((s) => {
            const p = getPatient(s.patientId);
            const b = getBranch(s.branchId);
            return (
              <Link key={s.id} to={`/patients/${p.id}`} className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors">
                <div className="h-10 w-10 rounded-xl bg-destructive/15 flex items-center justify-center shrink-0"><AlertTriangle className="h-5 w-5 text-destructive" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{p.name} · <span className="text-muted-foreground font-normal text-sm">{b.name.replace("Mayurah ", "")}</span></p>
                  <p className="text-xs text-muted-foreground">BMI {s.measurement.bmi} · Visceral Fat {s.measurement.visceralFat} · Health {s.measurement.healthScore} · {format(new Date(s.timestamp), "d MMM yyyy")}</p>
                </div>
                <StatusBadge status={s.status} />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="p-5 border-b border-border bg-warning-soft flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-warning" />
          <h3 className="font-bold text-warning">Attention — Schedule follow-up</h3>
        </div>
        <div className="divide-y divide-border">
          {attention.map((s) => {
            const p = getPatient(s.patientId);
            const b = getBranch(s.branchId);
            return (
              <Link key={s.id} to={`/patients/${p.id}`} className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors">
                <div className="h-10 w-10 rounded-xl bg-warning-soft flex items-center justify-center shrink-0"><Bell className="h-5 w-5 text-warning" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{p.name} · <span className="text-muted-foreground font-normal text-sm">{b.name.replace("Mayurah ", "")}</span></p>
                  <p className="text-xs text-muted-foreground">BMI {s.measurement.bmi} · Health {s.measurement.healthScore} · {format(new Date(s.timestamp), "d MMM yyyy")}</p>
                </div>
                <StatusBadge status={s.status} />
              </Link>
            );
          })}
        </div>
        <DataTablePagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
          totalItems={totalItems} 
          pageSize={pageSize} 
        />
      </div>
    </>
  );
}
