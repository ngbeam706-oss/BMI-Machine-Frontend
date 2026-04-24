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
  const hasRange = min !== undefined && max !== undefined;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50 p-3 transition-all hover:border-primary/20 hover:bg-white hover:shadow-md h-full">
      <div className="relative z-10">
        <p className="mb-2 truncate text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-primary/70" title={label}>
          {label}
        </p>
        <div className="flex flex-col items-baseline">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black tabular-nums text-slate-900 leading-none">
              {value}
            </span>
            {unit && <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">{unit}</span>}
          </div>
          {hasRange && (
            <p className="mt-1 text-[10px] font-medium text-slate-400/80">
              Std: <span className="text-slate-500 font-bold">{min}-{max}</span>
            </p>
          )}
        </div>
      </div>

      {(status || statusText) && (
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 relative z-10">
          <span className="text-[9px] font-bold uppercase tracking-tight text-slate-400">Status</span>
          <RangeBadge
            status={status || (statusText as any)}
            variant="small"
            className="h-4 px-1.5 text-[9px] font-black"
            style={statusColor ? { backgroundColor: `${statusColor}15`, color: statusColor, borderColor: `${statusColor}30` } : undefined}
          />
        </div>
      )}

      {/* Subtle accent line on hover */}
      <div className="absolute left-0 top-0 h-full w-0.5 bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}

export function MetricWide({ label, value, unit, min, max, statusText, statusColor }: MetricRowProps) {
  const numeric = typeof value === "number" ? value : null;
  const status = numeric !== null && min !== undefined && max !== undefined ? rangeStatusFor(numeric, min, max) : null;
  const hasRange = min !== undefined && max !== undefined;

  return (
    <div className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 transition-all hover:border-primary/20 hover:bg-white hover:shadow-md">
      <div className="relative z-10 flex flex-col gap-1 pr-4">
        <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 group-hover:text-primary transition-colors leading-tight">
          {label}
        </p>
        {hasRange && (
          <p className="text-[10px] font-bold text-slate-400">
            Standard: <span className="text-slate-500">{min}-{max}</span>
          </p>
        )}
      </div>

      <div className="relative z-10 flex flex-col items-end shrink-0">
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-xl font-black tabular-nums text-slate-900 leading-none">
            {value}
          </span>
          {unit && <span className="text-[10px] font-black text-slate-400 uppercase leading-none">{unit}</span>}
        </div>

        {(status || statusText) && (
          <RangeBadge
            status={status || (statusText as any)}
            variant="small"
            className="h-4.5 px-2 text-[9px] font-black"
            style={statusColor ? { backgroundColor: `${statusColor}15`, color: statusColor, borderColor: `${statusColor}30` } : undefined}
          />
        )}
      </div>

      {/* Subtle accent line on hover */}
      <div className="absolute left-0 top-0 h-full w-1 bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}

interface MetricGroupProps {
  title: string;
  icon: React.ReactNode;
  accent?: "primary" | "info" | "warning" | "accent" | "success";
  children: React.ReactNode;
  isGrid?: boolean;
  gridCols?: 1 | 2 | 3 | 4;
}

const accentMap = {
  primary: "bg-primary-soft text-primary",
  info: "bg-info-soft text-info",
  warning: "bg-warning-soft text-warning",
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
};

export function MetricGroup({
  title,
  icon,
  accent = "primary",
  children,
  isGrid,
  gridCols = 3,
  className
}: MetricGroupProps & { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md", className)}>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-transform hover:scale-105",
              accentMap[accent]
            )}
          >
            {icon}
          </div>

          <div>
            <h3 className="text-lg font-black tracking-tight text-slate-900 leading-none mb-1">
              {title}
            </h3>
            <div className="flex items-center gap-2">
              <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", accentMap[accent].split(" ")[1])} />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Clinical Data Layer
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          isGrid
            ? cn(
              "grid gap-3",
              gridCols === 4
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                : gridCols === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : gridCols === 1
                    ? "grid-cols-1"
                    : "grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
            )
            : "space-y-2"
        )}
      >
        {children}
      </div>

      {/* Decorative background element */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-slate-50 opacity-50" />
    </div>
  );
}
