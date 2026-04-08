import { Thermometer } from "lucide-react";
import { useWeatherData } from "@/hooks/useWeatherData";
import { DateTimeDisplay } from "@/components/DateTimeDisplay";
import { WeatherCard } from "@/components/WeatherCard";
import { PM25Indicator } from "@/components/PM25Indicator";
import { WeatherStatus } from "@/components/WeatherStatus";
import { Skeleton } from "@/components/ui/skeleton";

export const WeatherSlide = () => {
  const { data: weatherData, isLoading, error } = useWeatherData();

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-background p-4">
        <div className="stat-card text-center max-w-md">
          <h2 className="text-xl font-semibold text-destructive mb-2">
            ไม่สามารถโหลดข้อมูลได้
          </h2>
          <p className="text-muted-foreground">
            กรุณาตรวจสอบการเชื่อมต่อและลองใหม่อีกครั้ง
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rotate-90 h-[1080px]  bg-background p-0 overflow-hidden px-[120px]">
      {/* Date/Time Display - Large */}
      <div className="mb-0">
        <DateTimeDisplay
          lastUpdate={weatherData?.lastUpdate}
          humidity={weatherData?.currentHumidity}
          isLoading={isLoading}
        />
      </div>

      {/* Main Content - 3 Cards */}
      <div className="flex-1 min-h-0">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          weatherData && (
            <div className="flex flex-col md:grid-cols-1 gap-6 h-[full] w-[60%]">
              <WeatherStatus
                temp={weatherData.currentTemp}
                humidity={weatherData.currentHumidity}
                delay={200}
              />

              <WeatherCard
                title="อุณหภูมิ"
                value={weatherData.currentTemp}
                unit="°C"
                icon={Thermometer}
                iconColor="text-weather-temp"
                description="อุณหภูมิปัจจุบัน"
                delay={300}
              />

              <PM25Indicator value={weatherData.currentPM25} pm10={weatherData.currentPM10} pm1_0={weatherData.currentPM1_0} delay={400} />
            </div>
          )
        )}
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="stat-card flex flex-col justify-center">
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-16 w-48 mb-2" />
        <Skeleton className="h-6 w-full" />
      </div>
    ))}
  </div>
);
