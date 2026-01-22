import { useState, useEffect } from "react";
import { Calendar, Clock, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface DateTimeDisplayProps {
  lastUpdate?: Date;
  isLoading?: boolean;
}

export const DateTimeDisplay = ({ lastUpdate, isLoading }: DateTimeDisplayProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatThaiDate = (date: Date) => {
    return format(date, "EEEE d MMMM yyyy", { locale: th });
  };

  const formatTime = (date: Date) => {
    return format(date, "HH:mm:ss");
  };

  return (
    <div className="opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar className="w-8 h-8" />
            <span className="text-2xl md:text-3xl font-medium">{formatThaiDate(currentTime)}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-10 h-10 text-primary" />
            <span className="text-[80px] md:text-[100px] font-bold tracking-tight text-foreground font-mono leading-none">
              {formatTime(currentTime)}
            </span>
          </div>
        </div>

        {lastUpdate && (
          <div className="flex items-center gap-2 text-lg text-muted-foreground">
            <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
            <span>
              อัพเดทล่าสุด: {format(lastUpdate, "HH:mm:ss")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
