import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  variant?: "primary" | "accent" | "success" | "warning" | "info";
  className?: string;
}

const variants = {
  primary: { bg: "bg-primary-soft", icon: "text-primary", ring: "ring-primary/10" },
  accent: { bg: "bg-accent-soft", icon: "text-accent", ring: "ring-accent/10" },
  success: { bg: "bg-success-soft", icon: "text-success", ring: "ring-success/10" },
  warning: { bg: "bg-warning-soft", icon: "text-warning", ring: "ring-warning/10" },
  info: { bg: "bg-info-soft", icon: "text-info", ring: "ring-info/10" },
};

export function StatCard({ label, value, icon: Icon, trend, trendLabel, variant = "primary", className }: StatCardProps) {
  const v = variants[variant];
  const trendUp = (trend ?? 0) >= 0;
  return (
    <div className={cn("card-elevated p-5 hover:shadow-elevated transition-all duration-300 group", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold mt-2 text-foreground tracking-tight">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", trendUp ? "text-success" : "text-destructive")}>
                {trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(trend)}%
              </span>
              {trendLabel && <span className="text-xs text-muted-foreground">{trendLabel}</span>}
            </div>
          )}
        </div>
        <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center ring-4 transition-transform group-hover:scale-110", v.bg, v.ring)}>
          <Icon className={cn("h-5 w-5", v.icon)} strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
}
