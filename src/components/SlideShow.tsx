import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSlides } from "@/hooks/useSlides";
import { SlideRenderer } from "./SlideRenderer";
import { SlideIndicator } from "./SlideIndicator";
import { WeatherSidebar } from "./WeatherSidebar";
import { NewsTicker } from "./NewsTicker";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TransitionType } from "./AnimatedSlide";

// Transition variants for different effects
const slideVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  },
  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  },
  zoom: {
    initial: { opacity: 0, scale: 0.85 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.15 },
  },
  fadeZoom: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 },
  },
};

// Cycle through transition types for variety
const transitionTypes: TransitionType[] = ["fadeZoom", "slide", "zoom", "fade", "slideUp"];

export const SlideShow = () => {
  const { data: slides, isLoading, error } = useSlides();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [transitionType, setTransitionType] = useState<TransitionType>("fadeZoom");

  const currentSlide = slides?.[currentIndex];

  const goToNext = useCallback(() => {
    if (!slides || slides.length === 0) return;
    // Cycle transition type for variety
    setTransitionType(transitionTypes[(currentIndex + 1) % transitionTypes.length]);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides, currentIndex]);

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
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (error || !slides || slides.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
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
        </motion.div>
      </div>
    );
  }

  const showWeatherSidebar = currentSlide && currentSlide.type !== "weather";
  const variants = slideVariants[transitionType];

  return (
    <div className="h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Settings button */}
      <Link 
        to="/settings" 
        className="absolute top-4 z-50 opacity-30 hover:opacity-100 transition-opacity"
        style={{ right: showWeatherSidebar ? "17rem" : "1rem" }}
      >
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </Link>

      <div className="flex-1 flex overflow-hidden">
        {/* Main slide content with animations */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide?.id || currentIndex}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              transition={{
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="absolute inset-0"
            >
              {currentSlide && <SlideRenderer slide={currentSlide} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Weather Sidebar - shown on non-weather slides */}
        {showWeatherSidebar && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="w-64 shrink-0"
          >
            <WeatherSidebar />
          </motion.div>
        )}
      </div>

      {/* Slide indicators */}
      {slides.length > 1 && (
        <SlideIndicator
          total={slides.length}
          current={currentIndex}
          timeRemaining={timeRemaining}
          duration={currentSlide?.duration || 60}
          onSelect={(index) => {
            setTransitionType(transitionTypes[index % transitionTypes.length]);
            setCurrentIndex(index);
          }}
        />
      )}
    </div>
  );
};
