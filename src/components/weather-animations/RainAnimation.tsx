import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface RainDrop {
  id: number;
  left: number;
  delay: number;
  duration: number;
  opacity: number;
}

export const RainAnimation = () => {
  const [drops, setDrops] = useState<RainDrop[]>([]);

  useEffect(() => {
    const rainDrops: RainDrop[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 0.5 + Math.random() * 0.5,
      opacity: 0.3 + Math.random() * 0.5,
    }));
    setDrops(rainDrops);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Dark overlay for rainy mood */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-primary/20" />
      
      {/* Rain drops */}
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute w-0.5 h-8 bg-gradient-to-b from-primary/60 to-transparent rounded-full"
          style={{
            left: `${drop.left}%`,
            opacity: drop.opacity,
          }}
          initial={{ top: "-5%", opacity: 0 }}
          animate={{
            top: "105%",
            opacity: [0, drop.opacity, drop.opacity, 0],
          }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            delay: drop.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Splash effects at bottom */}
      {drops.slice(0, 15).map((drop) => (
        <motion.div
          key={`splash-${drop.id}`}
          className="absolute bottom-0 w-2 h-1 rounded-full bg-primary/30"
          style={{ left: `${drop.left}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 0.4,
            repeat: Infinity,
            delay: drop.delay + drop.duration,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Ripple effects */}
      {drops.slice(0, 8).map((drop) => (
        <motion.div
          key={`ripple-${drop.id}`}
          className="absolute bottom-2 w-4 h-1 border border-primary/20 rounded-full"
          style={{ left: `${drop.left}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 2, 3],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: drop.delay + drop.duration + 0.1,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};
