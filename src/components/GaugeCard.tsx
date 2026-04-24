import { cn } from "@/lib/utils";

interface GaugeCardProps {
  label: string;
  value: number;
  max?: number;
  min?: number;
  unit?: string;
  status?: string;
  thresholds?: { warning: number; danger: number };
  overrideColor?: string;
  className?: string;
}

export function GaugeCard({ label, value, max = 100, min = 0, unit = "", status, thresholds, overrideColor, className }: GaugeCardProps) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const danger = thresholds && value >= thresholds.danger;
  const warn = thresholds && value >= thresholds.warning && !danger;
  const color = overrideColor || (danger ? "hsl(var(--destructive))" : warn ? "hsl(var(--warning))" : "hsl(var(--success))");
  const bgColor = danger ? "bg-destructive-foreground" : warn ? "bg-warning-foreground" : "bg-success-foreground";

  // Half-circle gauge math
  const radius = 70;
  const circ = Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className={cn("card-elevated p-5 flex flex-col items-center text-center", className)}>
      <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
      <div className="relative" style={{ width: 160, height: 90 }}>
        <svg width="160" height="90" viewBox="0 0 160 90">
          <path d="M 10 80 A 70 70 0 0 1 150 80" fill="none" stroke="hsl(var(--muted))" strokeWidth="14" strokeLinecap="round" />
          <path
            d="M 10 80 A 70 70 0 0 1 150 80"
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black tabular-nums" style={{ color }}>{value}</span>
            {unit && <span className="text-[10px] text-muted-foreground font-bold">{unit}</span>}
          </div>
          {(min !== 0 || max !== 100) && (
            <span className="text-[10px] text-muted-foreground/60 font-medium -mt-1">
              Std: {min}-{max}
            </span>
          )}
        </div>
      </div>
      {status && <span className="mt-1 text-[11px] font-bold uppercase tracking-tight" style={{ color }}>{status}</span>}
    </div>
  );
}
