import { cn } from "@/lib/utils";
import { RangeBadge } from "./StatusBadges";
import { rangeStatusFor } from "@/data/mockData";

interface MetricRowProps {
  label: string;
  value: number | string;
  unit?: string;
  min?: number;
  max?: number;
  showRange?: boolean;
  statusText?: string;
  statusColor?: string;
}

export function MetricRow({ label, value, unit, min, max, showRange }: MetricRowProps) {
  const numeric = typeof value === "number" ? value : null;
  const status = numeric !== null && min !== undefined && max !== undefined ? rangeStatusFor(numeric, min, max) : null;

  return (
    <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/40 transition-colors">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        {showRange && min !== undefined && max !== undefined && (
          <span className="text-[10px] text-muted-foreground hidden sm:inline">{min}–{max}</span>
        )}
        <span className="font-semibold text-sm tabular-nums">{value}{unit && <span className="text-muted-foreground font-normal ml-0.5">{unit}</span>}</span>
        {status && <RangeBadge status={status} />}
      </div>
    </div>
  );
}

export function MetricSquare({ label, value, unit, min, max, statusText, statusColor }: MetricRowProps) {
  const numeric = typeof value === "number" ? value : null;
  const status = numeric !== null && min !== undefined && max !== undefined ? rangeStatusFor(numeric, min, max) : null;

  return (
    <div className="p-2.5 rounded-xl bg-muted/30 border border-transparent hover:border-border hover:bg-card hover:shadow-sm transition-all text-center">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-bold mb-1 truncate" title={label}>{label}</p>
      <p className="text-xl font-bold tabular-nums">
        {value}
        {unit && <span className="text-xs text-muted-foreground font-normal ml-0.5">{unit}</span>}
      </p>
      {(status || statusText) && (
        <div className="mt-1 flex justify-center">
          <RangeBadge 
            status={status || (statusText as any)} 
            variant="small" 
            style={statusColor ? { backgroundColor: `${statusColor}20`, color: statusColor, borderColor: `${statusColor}40` } : undefined}
          />
        </div>
      )}
    </div>
  );
}

interface MetricGroupProps {
  title: string;
  icon: React.ReactNode;
  accent?: "primary" | "info" | "warning" | "accent" | "success";
  children: React.ReactNode;
  isGrid?: boolean;
  gridCols?: 3 | 4;
}

const accentMap = {
  primary: "bg-primary-soft text-primary",
  info: "bg-info-soft text-info",
  warning: "bg-warning-soft text-warning",
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
};

export function MetricGroup({ title, icon, accent = "primary", children, isGrid, gridCols = 3 }: MetricGroupProps) {
  return (
    <div className="card-elevated p-4">
      <div className="flex items-center gap-2.5 mb-3">
        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", accentMap[accent])}>{icon}</div>
        <h3 className="font-bold text-foreground">{title}</h3>
      </div>
      <div className={cn(
        isGrid 
          ? cn("grid grid-cols-2 gap-2.5", gridCols === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3")
          : "space-y-0.5 divide-y divide-border/50"
      )}>
        {children}
      </div>
    </div>
  );
}
