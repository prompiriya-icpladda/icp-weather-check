import { Thermometer, Droplets, Wind } from "lucide-react";
import { useWeatherData } from "@/hooks/useWeatherData";
import { Skeleton } from "@/components/ui/skeleton";

export const WeatherSidebar = () => {
  const { data: weatherData, isLoading } = useWeatherData();

  if (isLoading) {
    return (
      <div className="h-full bg-card/80 backdrop-blur-sm border-l border-border p-4 flex flex-col gap-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!weatherData) return null;

  const getPM25Status = (value: number) => {
    if (value <= 25) return { label: "ดี", color: "text-green-500", bg: "bg-green-500/20" };
    if (value <= 37) return { label: "ปานกลาง", color: "text-yellow-500", bg: "bg-yellow-500/20" };
    if (value <= 50) return { label: "มีผลต่อกลุ่มเสี่ยง", color: "text-orange-500", bg: "bg-orange-500/20" };
    if (value <= 90) return { label: "มีผลต่อสุขภาพ", color: "text-red-500", bg: "bg-red-500/20" };
    return { label: "อันตราย", color: "text-purple-500", bg: "bg-purple-500/20" };
  };

  const pm25Status = getPM25Status(weatherData.currentPM25);

  return (
    <div className="h-full bg-gradient-to-b from-card/90 to-card/70 backdrop-blur-md border-l border-border/50 p-4 flex flex-col gap-4 overflow-hidden">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        สภาพอากาศ
      </h3>

      {/* Temperature */}
      <div className="bg-background/50 rounded-xl p-4 border border-border/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-weather-temp/20">
            <Thermometer className="h-5 w-5 text-weather-temp" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">อุณหภูมิ</p>
            <p className="text-2xl font-bold">{weatherData.currentTemp}°C</p>
          </div>
        </div>
      </div>

      {/* Humidity */}
      <div className="bg-background/50 rounded-xl p-4 border border-border/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-weather-humidity/20">
            <Droplets className="h-5 w-5 text-weather-humidity" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">ความชื้น</p>
            <p className="text-2xl font-bold">{weatherData.currentHumidity}%</p>
          </div>
        </div>
      </div>

      {/* PM2.5 */}
      <div className="bg-background/50 rounded-xl p-4 border border-border/30">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${pm25Status.bg}`}>
            <Wind className={`h-5 w-5 ${pm25Status.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">PM 2.5</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{weatherData.currentPM25}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${pm25Status.bg} ${pm25Status.color}`}>
                {pm25Status.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Last Update */}
      <div className="mt-auto pt-4 border-t border-border/30">
        <p className="text-xs text-muted-foreground text-center">
          อัพเดท: {weatherData.lastUpdate instanceof Date 
            ? weatherData.lastUpdate.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
            : String(weatherData.lastUpdate)}
        </p>
      </div>
    </div>
  );
};
