import { motion, AnimatePresence, Variants } from "framer-motion";
import { ReactNode } from "react";

export type TransitionType = "fade" | "slide" | "zoom" | "slideUp" | "fadeZoom";

interface AnimatedSlideProps {
  children: ReactNode;
  slideKey: string;
  transition?: TransitionType;
}

const transitionVariants: Record<TransitionType, Variants> = {
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
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 },
  },
  fadeZoom: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 },
  },
};

export const AnimatedSlide = ({
  children,
  slideKey,
  transition = "fadeZoom",
}: AnimatedSlideProps) => {
  const variants = transitionVariants[transition];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slideKey}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export const SlideTransitionWrapper = ({
  children,
  slideKey,
  transition = "fadeZoom",
}: AnimatedSlideProps) => {
  const variants = transitionVariants[transition];

  return (
    <motion.div
      key={slideKey}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="h-full w-full absolute inset-0"
    >
      {children}
    </motion.div>
  );
};
