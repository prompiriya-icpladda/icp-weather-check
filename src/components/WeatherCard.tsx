import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
}

export const WeatherCard = ({
  title,
  value,
  unit,
  icon: Icon,
  iconColor = "text-primary",
  description,
  children,
  className,
  delay = 0,
}: WeatherCardProps) => {
  return (
    <div
      className={cn(
        "stat-card opacity-0 animate-slide-up",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-3 rounded-xl bg-muted/50", iconColor)}>
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold tracking-tight text-foreground">
            {typeof value === "number" ? value.toFixed(1) : value}
          </span>
          <span className="text-2xl font-medium text-muted-foreground">
            {unit}
          </span>
        </div>

        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {children}
    </div>
  );
};
