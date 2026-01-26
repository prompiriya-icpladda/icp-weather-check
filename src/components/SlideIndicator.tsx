import { cn } from "@/lib/utils";

interface SlideIndicatorProps {
  total: number;
  current: number;
  timeRemaining: number;
  duration: number;
  onSelect: (index: number) => void;
}

export const SlideIndicator = ({
  total,
  current,
  timeRemaining,
  duration,
  onSelect,
}: SlideIndicatorProps) => {
  const progress = ((duration - timeRemaining) / duration) * 100;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={cn(
            "relative h-2 rounded-full transition-all overflow-hidden",
            index === current ? "w-12 bg-muted" : "w-2 bg-muted hover:bg-muted-foreground/50"
          )}
        >
          {index === current && (
            <div
              className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          )}
        </button>
      ))}
    </div>
  );
};
