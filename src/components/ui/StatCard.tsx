import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";
import { cn, trendColor } from "@/lib/utils";
import { Card } from "./Card";

export function StatCard({
  label,
  value,
  delta,
  deltaSuffix = "%",
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary-soft",
}: {
  label: string;
  value: string;
  delta?: number;
  deltaSuffix?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted">{label}</span>
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", iconBg)}>
          <Icon className={cn("w-4 h-4", iconColor)} strokeWidth={2} />
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <span className="text-2xl font-semibold tracking-tight">{value}</span>
        {delta !== undefined ? (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-semibold mb-0.5",
              trendColor(delta)
            )}
          >
            {delta > 0 ? (
              <ArrowUp className="w-3 h-3" />
            ) : delta < 0 ? (
              <ArrowDown className="w-3 h-3" />
            ) : null}
            {Math.abs(delta)}
            {deltaSuffix}
          </span>
        ) : null}
      </div>
    </Card>
  );
}
