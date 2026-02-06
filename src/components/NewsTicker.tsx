import { useTickerMessages } from "@/hooks/useTickerMessages";
import { motion } from "framer-motion";

export const NewsTicker = () => {
  const { data: messages, isLoading } = useTickerMessages();

  if (isLoading || !messages || messages.length === 0) {
    return null;
  }

  // Combine all messages with separator
  const combinedText = messages.map((m) => m.message).join("     •     ");
  // Duplicate for seamless loop
  const displayText = `${combinedText}     •     ${combinedText}`;

  return (
    <div className="w-full bg-primary/90 backdrop-blur-sm border-t border-primary-foreground/20 overflow-hidden">
      <div className="relative h-12 flex items-center">
        <motion.div
          className="flex whitespace-nowrap text-primary-foreground text-lg font-medium"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            x: {
              duration: messages.length * 15, // Adjust speed based on content
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
