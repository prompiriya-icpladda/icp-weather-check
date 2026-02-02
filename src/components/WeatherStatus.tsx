import { Sun, Cloud, CloudRain, Thermometer, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { WeatherAnimation, type WeatherCondition } from "./weather-animations";

interface WeatherStatusProps {
  temp: number;
  humidity: number;
  delay?: number;
}

export const WeatherStatus = ({ temp, humidity, delay = 0 }: WeatherStatusProps) => {
  const getWeatherCondition = (): { 
    icon: typeof Sun; 
    label: string; 
    description: string; 
    bgClass: string; 
    iconClass: string; 
    glowClass: string;
    animationCondition: WeatherCondition;
  } => {
    if (humidity > 80) {
      return {
        icon: CloudRain,
        label: "ฝนตก",
        description: "ความชื้นสูง มีโอกาสฝนตก",
        bgClass: "bg-gradient-to-br from-primary/20 to-secondary/20",
        iconClass: "text-primary",
        glowClass: "shadow-glow-primary",
        animationCondition: "rainy",
      };
    } else if (humidity > 60) {
      return {
        icon: Cloud,
        label: "มีเมฆ",
        description: "อากาศครึ้ม มีเมฆบางส่วน",
        bgClass: "bg-gradient-to-br from-muted to-muted/50",
        iconClass: "text-muted-foreground",
        glowClass: "",
        animationCondition: "cloudy",
      };
    } else {
      return {
        icon: Sun,
        label: "แดดออก",
        description: "ท้องฟ้าแจ่มใส อากาศดี",
        bgClass: "bg-gradient-to-br from-accent/20 to-yellow-400/20",
        iconClass: "text-accent",
        glowClass: "shadow-glow-warm",
        animationCondition: "sunny",
      };
    }
  };

  const getTempStatus = () => {
    if (temp > 35) {
      return { label: "ร้อนจัด", color: "text-destructive", bgColor: "bg-destructive/10" };
    } else if (temp > 30) {
      return { label: "ร้อน", color: "text-weather-temp", bgColor: "bg-weather-temp/10" };
    } else if (temp > 25) {
      return { label: "อบอุ่น", color: "text-accent", bgColor: "bg-accent/10" };
    } else if (temp > 20) {
      return { label: "เย็นสบาย", color: "text-secondary", bgColor: "bg-secondary/10" };
    } else {
      return { label: "หนาว", color: "text-primary", bgColor: "bg-primary/10" };
    }
  };

  const weather = getWeatherCondition();
  const tempStatus = getTempStatus();
  const WeatherIcon = weather.icon;

  return (
    <div
      className="stat-card opacity-0 animate-slide-up h-full flex flex-col justify-center relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/5 to-transparent rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-6 mb-6">
          <div className={cn("p-6 rounded-3xl transition-all duration-300", weather.bgClass, weather.glowClass)}>
            <WeatherIcon className={cn("w-20 h-20 animate-float", weather.iconClass)} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-6xl md:text-7xl font-bold text-foreground">{weather.label}</h3>
              <Sparkles className="w-8 h-8 text-accent animate-pulse-soft" />
            </div>
            <p className="text-2xl text-muted-foreground mt-2">{weather.description}</p>
          </div>
        </div>

        <div className={cn("flex items-center gap-4 p-4 rounded-2xl mt-4", tempStatus.bgColor)}>
          <Thermometer className={cn("w-10 h-10", tempStatus.color)} />
          <div className="flex items-baseline gap-3">
            <span className={cn("text-4xl font-bold", tempStatus.color)}>
              {tempStatus.label}
            </span>
            <span className="text-3xl text-muted-foreground">
              {temp.toFixed(1)}°C
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
