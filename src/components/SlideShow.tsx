import { useState, useEffect, useCallback } from "react";
import { useSlides } from "@/hooks/useSlides";
import { SlideRenderer } from "./SlideRenderer";
import { SlideIndicator } from "./SlideIndicator";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const SlideShow = () => {
  const { data: slides, isLoading, error } = useSlides();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);

  const currentSlide = slides?.[currentIndex];

  const goToNext = useCallback(() => {
    if (!slides || slides.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides]);

  // Auto-advance slides
  useEffect(() => {
    if (!currentSlide) return;

    setTimeRemaining(currentSlide.duration);

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          goToNext();
          return currentSlide.duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSlide, goToNext]);

  // Reset index when slides change
  useEffect(() => {
    if (slides && currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [slides, currentIndex]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (error || !slides || slides.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-destructive mb-2">
            ไม่มีสไลด์
          </h2>
          <p className="text-muted-foreground mb-4">
            กรุณาเพิ่มสไลด์ในหน้าตั้งค่า
          </p>
          <Link to="/settings">
            <Button>
              <Settings className="mr-2 h-4 w-4" />
              ไปหน้าตั้งค่า
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background relative">
      {/* Settings button */}
      <Link 
        to="/settings" 
        className="absolute top-4 right-4 z-50 opacity-30 hover:opacity-100 transition-opacity"
      >
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </Link>

      {/* Main slide content */}
      <div className="flex-1 overflow-hidden">
        {currentSlide && <SlideRenderer slide={currentSlide} />}
      </div>

      {/* Slide indicators */}
      {slides.length > 1 && (
        <SlideIndicator
          total={slides.length}
          current={currentIndex}
          timeRemaining={timeRemaining}
          duration={currentSlide?.duration || 60}
          onSelect={setCurrentIndex}
        />
      )}
    </div>
  );
};
