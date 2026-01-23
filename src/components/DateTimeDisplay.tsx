import { useState, useEffect } from "react";
import { Calendar, Clock, Droplets, RefreshCw, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface DateTimeDisplayProps {
  lastUpdate?: Date;
  humidity?: number;
  isLoading?: boolean;
}

export const DateTimeDisplay = ({ lastUpdate, humidity, isLoading }: DateTimeDisplayProps) => {
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
    <div className="opacity-0 animate-fade-in relative" style={{ animationDelay: "100ms" }}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="p-2 rounded-xl bg-primary/10">
              <Calendar className="w-7 h-7 text-primary" />
            </div>
            <span className="text-3xl md:text-4xl font-medium">{formatThaiDate(currentTime)}</span>
            <Sparkles className="w-5 h-5 text-accent animate-pulse-soft" />
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/10 shadow-lg">
              <Clock className="w-10 h-10 text-primary" />
            </div>
            <span className={cn(
              "text-[96px] md:text-[132px] font-bold tracking-tight font-mono leading-none",
              "bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent",
              "bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]"
            )}>
              {formatTime(currentTime)}
            </span>
          </div>
        </div>

        {(lastUpdate || typeof humidity === "number") && (
          <div className="px-5 py-4 rounded-2xl bg-muted/50 backdrop-blur-sm">
            {lastUpdate && (
              <div className="flex items-center gap-3">
                <RefreshCw
                  className={cn("w-6 h-6 text-primary", isLoading && "animate-spin")}
                />
                <span className="text-xl text-muted-foreground">
                  อัพเดทล่าสุด: <span className="font-semibold text-foreground">{format(lastUpdate, "HH:mm:ss")}</span>
                </span>

                {typeof humidity === "number" && (
                  <Badge variant="secondary" className="ml-1 px-3 py-1 text-base font-semibold">
                    <span className="inline-flex items-center gap-2">
                      <Droplets className="h-4 w-4" />
                      <span>{humidity.toFixed(1)}%</span>
                    </span>
                  </Badge>
                )}
              </div>
            )}

            {typeof humidity === "number" && !lastUpdate && (
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="px-3 py-1 text-base font-semibold">
                  <span className="inline-flex items-center gap-2">
                    <Droplets className="h-4 w-4" />
                    <span>ความชื้นสัมพัทธ์ {humidity.toFixed(1)}%</span>
                  </span>
                </Badge>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
