import { Wind } from "lucide-react";
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
        return "text-weather-pm-good bg-weather-pm-good/10";
      case "weather-pm-moderate":
        return "text-weather-pm-moderate bg-weather-pm-moderate/10";
      case "weather-pm-unhealthy":
        return "text-weather-pm-unhealthy bg-weather-pm-unhealthy/10";
      case "weather-pm-hazardous":
        return "text-weather-pm-hazardous bg-weather-pm-hazardous/10";
      default:
        return "text-primary bg-primary/10";
    }
  };

  const getBadgeColor = () => {
    switch (color) {
      case "weather-pm-good":
        return "bg-weather-pm-good";
      case "weather-pm-moderate":
        return "bg-weather-pm-moderate";
      case "weather-pm-unhealthy":
        return "bg-weather-pm-unhealthy";
      case "weather-pm-hazardous":
        return "bg-weather-pm-hazardous";
      default:
        return "bg-primary";
    }
  };

  const getProgressWidth = () => {
    // Scale: 0-25 good, 25-50 moderate, 50-100 unhealthy, 100+ hazardous
    const maxValue = 200;
    return Math.min((value / maxValue) * 100, 100);
  };

  return (
    <div
      className="stat-card opacity-0 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-3 rounded-xl", getColorClass())}>
            <Wind className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            ฝุ่น PM 2.5
          </span>
        </div>
        <div
          className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold text-primary-foreground",
            getBadgeColor()
          )}
        >
          {level}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold tracking-tight text-foreground">
            {value.toFixed(1)}
          </span>
          <span className="text-2xl font-medium text-muted-foreground">
            μg/m³
          </span>
        </div>

        <p className="text-sm text-muted-foreground">{description}</p>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000 ease-out",
                getBadgeColor()
              )}
              style={{ width: `${getProgressWidth()}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>50</span>
            <span>100</span>
            <span>150</span>
            <span>200+</span>
          </div>
        </div>
      </div>
    </div>
  );
};
