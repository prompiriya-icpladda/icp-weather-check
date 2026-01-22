import { Sun, Cloud, CloudRain, Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherStatusProps {
  temp: number;
  humidity: number;
  delay?: number;
}

export const WeatherStatus = ({ temp, humidity, delay = 0 }: WeatherStatusProps) => {
  const getWeatherCondition = () => {
    if (humidity > 80) {
      return {
        icon: CloudRain,
        label: "ฝนตก",
        description: "ความชื้นสูง มีโอกาสฝนตก",
        bgClass: "bg-primary/10 text-primary",
      };
    } else if (humidity > 60) {
      return {
        icon: Cloud,
        label: "มีเมฆ",
        description: "อากาศครึ้ม มีเมฆบางส่วน",
        bgClass: "bg-muted text-muted-foreground",
      };
    } else {
      return {
        icon: Sun,
        label: "แดดออก",
        description: "ท้องฟ้าแจ่มใส อากาศดี",
        bgClass: "bg-accent/10 text-accent",
      };
    }
  };

  const getTempStatus = () => {
    if (temp > 35) {
      return { label: "ร้อนจัด", color: "text-destructive" };
    } else if (temp > 30) {
      return { label: "ร้อน", color: "text-weather-temp" };
    } else if (temp > 25) {
      return { label: "อบอุ่น", color: "text-accent" };
    } else if (temp > 20) {
      return { label: "เย็นสบาย", color: "text-secondary" };
    } else {
      return { label: "หนาว", color: "text-primary" };
    }
  };

  const weather = getWeatherCondition();
  const tempStatus = getTempStatus();
  const WeatherIcon = weather.icon;

  return (
    <div
      className="stat-card opacity-0 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={cn("p-4 rounded-2xl", weather.bgClass)}>
          <WeatherIcon className="w-10 h-10 animate-float" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-foreground">{weather.label}</h3>
          <p className="text-sm text-muted-foreground">{weather.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-border">
        <Thermometer className={cn("w-5 h-5", tempStatus.color)} />
        <span className={cn("text-sm font-medium", tempStatus.color)}>
          {tempStatus.label}
        </span>
        <span className="text-sm text-muted-foreground">
          — อุณหภูมิ {temp.toFixed(1)}°C
        </span>
      </div>
    </div>
  );
};
