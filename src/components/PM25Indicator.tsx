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
      className="stat-card opacity-0 animate-slide-up h-full flex flex-col justify-center"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={cn("p-4 rounded-2xl", getColorClass())}>
            <Wind className="w-10 h-10" />
          </div>
          <span className="text-2xl md:text-3xl font-semibold text-muted-foreground uppercase tracking-wide">
            ฝุ่น PM 2.5
          </span>
        </div>
        <div
          className={cn(
            "px-4 py-2 rounded-full text-sm font-semibold text-primary-foreground",
            getBadgeColor()
          )}
        >
          {level}
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-baseline gap-3">
          <span className="text-7xl md:text-8xl font-bold tracking-tight text-foreground">
            {value.toFixed(1)}
          </span>
          <span className="text-4xl font-medium text-muted-foreground">
            μg/m³
          </span>
        </div>

        <p className="text-lg text-muted-foreground">{description}</p>

        {/* Progress bar */}
        <div className="space-y-3">
          <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000 ease-out",
                getBadgeColor()
              )}
              style={{ width: `${getProgressWidth()}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
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
