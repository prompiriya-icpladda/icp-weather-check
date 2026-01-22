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
  const isTemp = title.includes("อุณหภูมิ");
  const isHumidity = title.includes("ความชื้น");
  
  const getGradientBg = () => {
    if (isTemp) return "from-orange-500/10 to-red-500/5";
    if (isHumidity) return "from-blue-500/10 to-cyan-500/5";
    return "from-primary/10 to-secondary/5";
  };

  const getIconBg = () => {
    if (isTemp) return "bg-gradient-to-br from-orange-100 to-red-50 dark:from-orange-900/30 dark:to-red-900/20";
    if (isHumidity) return "bg-gradient-to-br from-blue-100 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/20";
    return "bg-muted/50";
  };

  return (
    <div
      className={cn(
        "stat-card opacity-0 animate-slide-up h-full flex flex-col justify-center relative overflow-hidden",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Decorative gradient background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-50",
        getGradientBg()
      )} />
      
      {/* Floating decorative circles */}
      <div className={cn(
        "absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30",
        isTemp ? "bg-orange-400" : isHumidity ? "bg-blue-400" : "bg-primary"
      )} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={cn("p-4 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105", getIconBg(), iconColor)}>
              <Icon className="w-12 h-12" />
            </div>
            <span className="text-2xl md:text-3xl font-semibold text-muted-foreground uppercase tracking-wide">
              {title}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <span className={cn(
              "text-7xl md:text-8xl font-bold tracking-tight",
              isTemp ? "bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent" :
              isHumidity ? "bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent" :
              "text-foreground"
            )}>
              {typeof value === "number" ? value.toFixed(1) : value}
            </span>
            <span className="text-4xl font-medium text-muted-foreground">
              {unit}
            </span>
          </div>

          {description && (
            <p className="text-xl text-muted-foreground">{description}</p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
};
