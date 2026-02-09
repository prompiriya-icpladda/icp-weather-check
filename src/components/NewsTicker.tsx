import { useTickerMessages } from "@/hooks/useTickerMessages";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const DEFAULT_SPEED = 50; // Default speed (1-100 scale)

export const NewsTicker = () => {
  const { data: messages, isLoading } = useTickerMessages();
  const [speed, setSpeed] = useState(DEFAULT_SPEED);

  useEffect(() => {
    const savedSpeed = localStorage.getItem("ticker-speed");
    if (savedSpeed) {
      setSpeed(Number(savedSpeed));
    }

    // Listen for speed changes from settings
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "ticker-speed" && e.newValue) {
        setSpeed(Number(e.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (isLoading || !messages || messages.length === 0) {
    return null;
  }

  // Combine all messages with separator
  const combinedText = messages.map((m) => m.message).join("     •     ");
  // Duplicate for seamless loop
  const displayText = `${combinedText}     •     ${combinedText}`;

  // Calculate duration based on speed (higher speed = shorter duration)
  // Speed 1 = slowest (30s per message), Speed 100 = fastest (5s per message)
  const baseDuration = messages.length * (35 - (speed * 0.3));

  return (
    <div className="w-full bg-primary/90 backdrop-blur-sm border-t border-primary-foreground/20 overflow-hidden">
      <div className="relative h-12 flex items-center">
        <motion.div
          key={speed} // Re-render animation when speed changes
          className="flex whitespace-nowrap text-primary-foreground text-lg font-medium"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            x: {
              duration: baseDuration,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        >
          <span className="px-4">{displayText}</span>
        </motion.div>
      </div>
    </div>
  );
};
