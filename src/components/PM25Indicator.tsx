import { Wind, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { getPM25Level } from "@/hooks/useWeatherData";
import { cn } from "@/lib/utils";

interface PM25IndicatorProps {
  value: number;
  delay?: number;
}

export const PM25Indicator = ({ value, delay = 0 }: PM25IndicatorProps) => {
  const { level, color, description } = getPM25Level(value);

  const getColorClass = () => {
    switch (color) {
      case "weather-pm-good":
        return "text-weather-pm-good bg-gradient-to-br from-weather-pm-good/20 to-weather-pm-good/5";
      case "weather-pm-moderate":
        return "text-weather-pm-moderate bg-gradient-to-br from-weather-pm-moderate/20 to-weather-pm-moderate/5";
      case "weather-pm-unhealthy":
        return "text-weather-pm-unhealthy bg-gradient-to-br from-weather-pm-unhealthy/20 to-weather-pm-unhealthy/5";
      case "weather-pm-hazardous":
        return "text-weather-pm-hazardous bg-gradient-to-br from-weather-pm-hazardous/20 to-weather-pm-hazardous/5";
      default:
        return "text-primary bg-gradient-to-br from-primary/20 to-primary/5";
    }
  };

  const getBadgeColor = () => {
    switch (color) {
      case "weather-pm-good":
        return "bg-gradient-to-r from-weather-pm-good to-emerald-500";
      case "weather-pm-moderate":
        return "bg-gradient-to-r from-weather-pm-moderate to-yellow-500";
      case "weather-pm-unhealthy":
        return "bg-gradient-to-r from-weather-pm-unhealthy to-orange-600";
      case "weather-pm-hazardous":
        return "bg-gradient-to-r from-weather-pm-hazardous to-red-600";
      default:
        return "bg-gradient-to-r from-primary to-secondary";
    }
  };

  const getStatusIcon = () => {
    switch (color) {
      case "weather-pm-good":
        return <CheckCircle className="w-6 h-6" />;
      case "weather-pm-moderate":
        return <AlertCircle className="w-6 h-6" />;
      case "weather-pm-unhealthy":
      case "weather-pm-hazardous":
        return <AlertTriangle className="w-6 h-6 animate-pulse" />;
      default:
        return <CheckCircle className="w-6 h-6" />;
    }
  };

  const getProgressWidth = () => {
    const maxValue = 200;
    return Math.min((value / maxValue) * 100, 100);
  };

  const getProgressGradient = () => {
    const percentage = getProgressWidth();
    if (percentage <= 12.5) return "from-weather-pm-good via-weather-pm-good to-weather-pm-good";
    if (percentage <= 25) return "from-weather-pm-good via-weather-pm-moderate to-weather-pm-moderate";
    if (percentage <= 50) return "from-weather-pm-good via-weather-pm-moderate to-weather-pm-unhealthy";
    return "from-weather-pm-good via-weather-pm-unhealthy to-weather-pm-hazardous";
  };

  return (
    <div
      className="stat-card opacity-0 animate-slide-up h-full flex flex-col justify-center relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Decorative background */}
      <div className={cn(
        "absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-20",
        color === "weather-pm-good" ? "bg-weather-pm-good" :
        color === "weather-pm-moderate" ? "bg-weather-pm-moderate" :
        color === "weather-pm-unhealthy" ? "bg-weather-pm-unhealthy" :
        "bg-weather-pm-hazardous"
      )} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={cn("p-4 rounded-2xl transition-all duration-300", getColorClass())}>
              <Wind className="w-12 h-12 animate-pulse-soft" />
            </div>
            <span className="text-2xl md:text-3xl font-semibold text-muted-foreground uppercase tracking-wide">
              ฝุ่น PM 2.5
            </span>
          </div>
          <div
            className={cn(
              "px-5 py-3 rounded-full text-lg font-bold text-white flex items-center gap-2 shadow-lg",
              getBadgeColor()
            )}
          >
            {getStatusIcon()}
            {level}
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-baseline gap-3">
            <span className={cn(
              "text-7xl md:text-8xl font-bold tracking-tight",
              color === "weather-pm-good" ? "text-weather-pm-good" :
              color === "weather-pm-moderate" ? "text-weather-pm-moderate" :
              color === "weather-pm-unhealthy" ? "text-weather-pm-unhealthy" :
              color === "weather-pm-hazardous" ? "text-weather-pm-hazardous" :
              "text-foreground"
            )}>
              {value.toFixed(1)}
            </span>
            <span className="text-4xl font-medium text-muted-foreground">
              μg/m³
            </span>
          </div>

          <p className="text-xl text-muted-foreground">{description}</p>

          {/* Enhanced Progress bar */}
          <div className="space-y-3">
            <div className="h-5 w-full bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r shadow-md",
                  getProgressGradient()
                )}
                style={{ width: `${getProgressWidth()}%` }}
              />
            </div>
            <div className="flex justify-between text-sm font-medium text-muted-foreground">
              <span className="text-weather-pm-good">0</span>
              <span className="text-weather-pm-moderate">50</span>
              <span className="text-weather-pm-unhealthy">100</span>
              <span className="text-weather-pm-hazardous">150</span>
              <span className="text-weather-pm-hazardous">200+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
