import { cn } from "@/lib/utils";
import type { ScanStatus, DeviceStatus, RangeStatus } from "@/data/mockData";

const scanMap: Record<ScanStatus, string> = {
  Normal: "bg-success-soft text-success border-success/20",
  Attention: "bg-warning-soft text-warning border-warning/20",
  Critical: "bg-destructive/10 text-destructive border-destructive/20",
};

const deviceMap: Record<DeviceStatus, string> = {
  Online: "bg-success-soft text-success border-success/20",
  Offline: "bg-destructive/10 text-destructive border-destructive/20",
  Syncing: "bg-info-soft text-info border-info/20",
  Maintenance: "bg-warning-soft text-warning border-warning/20",
};

const rangeMap: Record<RangeStatus, string> = {
  Insufficient: "bg-warning-soft text-warning border-warning/20",
  Standard: "bg-success-soft text-success border-success/20",
  Excellent: "bg-info-soft text-info border-info/20",
  High: "bg-warning-soft text-warning border-warning/20",
  "High Risk": "bg-destructive/10 text-destructive border-destructive/20",
};

export function StatusBadge({ status, className }: { status: ScanStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border", scanMap[status], className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full",
        status === "Normal" ? "bg-success" : status === "Attention" ? "bg-warning" : "bg-destructive"
      )} />
      {status}
    </span>
  );
}

export function DeviceStatusBadge({ status, className }: { status: DeviceStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border", deviceMap[status], className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full",
        status === "Online" ? "bg-success animate-pulse-soft" : status === "Offline" ? "bg-destructive" : status === "Syncing" ? "bg-info animate-pulse-soft" : "bg-warning"
      )} />
      {status}
    </span>
  );
}

export function RangeBadge({ 
  status, 
  className, 
  variant = "default",
  style 
}: { 
  status: RangeStatus | string; 
  className?: string; 
  variant?: "default" | "small";
  style?: React.CSSProperties;
}) {
  const isSmall = variant === "small";
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-md font-bold uppercase tracking-wide border", 
        isSmall ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]",
        (rangeMap as any)[status] || "bg-muted text-muted-foreground border-border", 
        className
      )}
      style={style}
    >
      {status}
    </span>
  );
}
