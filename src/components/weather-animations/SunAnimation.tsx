import { motion } from "framer-motion";

export const SunAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Warm gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-yellow-400/10" />

      {/* Main sun glow */}
      <motion.div
        className="absolute -top-20 -right-20 w-80 h-80"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Outer glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-radial from-yellow-300/30 via-accent/20 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Inner glow */}
        <motion.div
          className="absolute inset-8 rounded-full bg-gradient-radial from-yellow-200/40 via-accent/30 to-transparent blur-2xl"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        {/* Core */}
        <motion.div
          className="absolute inset-16 rounded-full bg-gradient-radial from-yellow-100/50 via-accent/40 to-transparent blur-xl"
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Sun rays */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 right-0 origin-bottom-left"
          style={{
            width: "2px",
            height: "150px",
            background: "linear-gradient(to top, transparent, hsl(var(--accent) / 0.3), transparent)",
            transform: `rotate(${i * 30}deg) translateX(80px)`,
          }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scaleY: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating light particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-accent/40"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${10 + Math.random() * 50}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Lens flare effect */}
      <motion.div
        className="absolute top-10 right-40 w-20 h-20 rounded-full bg-gradient-radial from-white/20 to-transparent blur-md"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};
