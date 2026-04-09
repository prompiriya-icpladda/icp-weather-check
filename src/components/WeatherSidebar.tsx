import { Thermometer, Droplets, Wind } from "lucide-react";
import { useWeatherData } from "@/hooks/useWeatherData";
import { Skeleton } from "@/components/ui/skeleton";

export const WeatherSidebar = () => {
  const { data: weatherData, isLoading } = useWeatherData();

  if (isLoading) {
    return (
      <div className="h-full bg-card/80 backdrop-blur-sm border-l border-border p-6 flex gap-10 flex-col">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
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
    <div className=" h-full  justify-center bg-gradient-to-b from-card/90 to-card/70 backdrop-blur-md border-l border-border/50  flex overflow-hidden ">

      <div className="">
        <h3 className="rotate-90 text-xl font-bold text-foreground uppercase tracking-wider ">
          สภาพอากาศ
        </h3>
      </div>

      <div className="rotate-90 flex gap-6">
        {/* Temperature */}
      <div className=" bg-background/50 rounded-xl p-3 border border-border/20 flex-1 flex items-center">
        <div className="flex items-center gap-4 w-full">
          <div className="p-2 rounded-lg bg-weather-temp/20">
            <Thermometer className="h-8 w-8 text-weather-temp" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground font-medium">อุณหภูมิ</p>
            <p className="text-3xl font-bold leading-tight">{weatherData.currentTemp}°C</p>
          </div>
        </div>
      </div>

      {/* Humidity */}
      <div className=" bg-background/50 rounded-2xl p-5 border border-border/30 flex-1 flex items-center">
        <div className="flex items-center gap-4 w-full">
          <div className="p-3 rounded-xl bg-weather-humidity/20">
            <Droplets className="h-8 w-8 text-weather-humidity" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground font-medium">ความชื้น</p>
            <p className="text-3xl font-bold leading-tight">{weatherData.currentHumidity}%</p>
          </div>
        </div>
      </div>

      {/* PM2.5 */}
      <div className=" bg-background/50 rounded-xl p-5 border border-border/30 flex-1 flex items-center">
        <div className="flex items-center gap-4 w-full">
          <div className={`p-3 rounded-xl ${pm25Status.bg}`}>
            <Wind className={`h-8 w-8 ${pm25Status.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground font-medium">PM 2.5</p>
            <p className="text-3xl font-bold leading-tight">{weatherData.currentPM25}</p>
            <span className={`text-sm px-3 py-1 rounded-full ${pm25Status.bg} ${pm25Status.color} font-medium inline-block mt-1`}>
              {pm25Status.label}
            </span>
            <div className="flex gap-3 mt-2 text-sm text-muted-foreground">
              <span>PM1.0: <strong className="text-foreground">{weatherData.currentPM1_0}</strong></span>
              <span>PM10: <strong className="text-foreground">{weatherData.currentPM10}</strong></span>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Last Update */}
      <div className="rotate-90 pt-[220px] border-t border-border/30">
        <p className="text-sm text-muted-foreground text-center">
          อัพเดท: {weatherData.lastUpdate instanceof Date 
            ? weatherData.lastUpdate.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
            : String(weatherData.lastUpdate)}
        </p>
      </div>
    </div>
  );
};
