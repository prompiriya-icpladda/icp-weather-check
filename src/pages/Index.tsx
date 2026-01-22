import { Thermometer, Droplets, MapPin } from "lucide-react";
import { useWeatherData } from "@/hooks/useWeatherData";
import { DateTimeDisplay } from "@/components/DateTimeDisplay";
import { WeatherCard } from "@/components/WeatherCard";
import { PM25Indicator } from "@/components/PM25Indicator";
import { WeatherChart } from "@/components/WeatherChart";
import { WeatherStatus } from "@/components/WeatherStatus";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: weatherData, isLoading, error } = useWeatherData();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="weather-gradient-bg text-primary-foreground py-8 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-2 mb-4 opacity-90">
            <MapPin className="w-5 h-5" />
            <span className="text-sm font-medium">สถานีตรวจวัดอากาศ</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Weather Dashboard
          </h1>
          <p className="text-primary-foreground/80">
            ระบบแสดงข้อมูลสภาพอากาศแบบ Realtime
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-4 md:px-8 py-8">
        {/* Date/Time Display */}
        <div className="mb-8">
          <DateTimeDisplay
            lastUpdate={weatherData?.lastUpdate}
            isLoading={isLoading}
          />
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          weatherData && (
            <div className="space-y-6">
              {/* Weather Status & Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

                <WeatherCard
                  title="ความชื้น"
                  value={weatherData.currentHumidity}
                  unit="%"
                  icon={Droplets}
                  iconColor="text-weather-humidity"
                  description="ความชื้นสัมพัทธ์"
                  delay={400}
                />

                <PM25Indicator value={weatherData.currentPM25} delay={500} />
              </div>

              {/* Chart */}
              <WeatherChart data={weatherData.history} delay={600} />
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4 mt-8">
        <div className="container mx-auto max-w-7xl text-center text-sm text-muted-foreground">
          <p>ข้อมูลอัพเดทอัตโนมัติทุก 30 วินาที</p>
        </div>
      </footer>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="stat-card">
          <Skeleton className="h-6 w-24 mb-4" />
          <Skeleton className="h-12 w-32 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
    <div className="stat-card">
      <Skeleton className="h-6 w-48 mb-6" />
      <Skeleton className="h-80 w-full" />
    </div>
  </div>
);

export default Index;
