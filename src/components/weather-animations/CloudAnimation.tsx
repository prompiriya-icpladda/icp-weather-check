import { motion } from "framer-motion";

interface CloudProps {
  className?: string;
  delay?: number;
  duration?: number;
  size?: "sm" | "md" | "lg";
}

const Cloud = ({ className = "", delay = 0, duration = 20, size = "md" }: CloudProps) => {
  const sizeClasses = {
    sm: "w-24 h-12",
    md: "w-40 h-20",
    lg: "w-56 h-28",
  };

  return (
    <motion.div
      className={`absolute ${sizeClasses[size]} ${className}`}
      initial={{ x: "-100%" }}
      animate={{ x: "calc(100vw + 100%)" }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "linear",
      }}
    >
      <div className="relative w-full h-full">
        {/* Main cloud body */}
        <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-muted-foreground/20 rounded-full blur-sm" />
        <div className="absolute bottom-1/4 left-1/6 w-2/5 h-2/3 bg-muted-foreground/25 rounded-full blur-sm" />
        <div className="absolute bottom-1/4 right-1/6 w-2/5 h-2/3 bg-muted-foreground/25 rounded-full blur-sm" />
        <div className="absolute bottom-1/3 left-1/3 w-1/3 h-3/4 bg-muted-foreground/30 rounded-full blur-sm" />
      </div>
    </motion.div>
  );
};

export const CloudAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Cloudy gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-transparent to-muted/10" />

      {/* Moving clouds at different speeds and positions */}
      <Cloud className="top-[5%]" delay={0} duration={25} size="lg" />
      <Cloud className="top-[15%]" delay={5} duration={30} size="md" />
      <Cloud className="top-[10%]" delay={10} duration={22} size="sm" />
      <Cloud className="top-[25%]" delay={3} duration={28} size="lg" />
      <Cloud className="top-[20%]" delay={8} duration={35} size="md" />
      <Cloud className="top-[30%]" delay={15} duration={26} size="sm" />

      {/* Static atmospheric clouds in background */}
      <motion.div
        className="absolute top-[5%] left-[10%] w-64 h-32 bg-muted-foreground/10 rounded-full blur-3xl"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-[15%] right-[15%] w-48 h-24 bg-muted-foreground/10 rounded-full blur-3xl"
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute top-[25%] left-[30%] w-72 h-36 bg-muted-foreground/8 rounded-full blur-3xl"
        animate={{
          opacity: [0.15, 0.3, 0.15],
          scale: [1, 1.04, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />

      {/* Subtle mist/fog at bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-muted/30 to-transparent"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};
