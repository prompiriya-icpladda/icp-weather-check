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
        "stat-card opacity-0 animate-slide-up h-full flex flex-col justify-center",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={cn("p-4 rounded-2xl bg-muted/50", iconColor)}>
            <Icon className="w-10 h-10" />
          </div>
          <span className="text-2xl md:text-3xl font-semibold text-muted-foreground uppercase tracking-wide">
            {title}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline gap-3">
          <span className="text-7xl md:text-8xl font-bold tracking-tight text-foreground">
            {typeof value === "number" ? value.toFixed(1) : value}
          </span>
          <span className="text-4xl font-medium text-muted-foreground">
            {unit}
          </span>
        </div>

        {description && (
          <p className="text-lg text-muted-foreground">{description}</p>
        )}
      </div>

      {children}
    </div>
  );
};
