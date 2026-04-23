import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  showCursor?: boolean;
  cursorColor?: string;
  playSound?: boolean;
}

export function TypewriterText({
  text,
  delay = 0,
  speed = 50,
  className = "",
  onComplete,
  showCursor = true,
  cursorColor = "currentColor",
  playSound = false
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
        
        // Play typing sound effect (optional)
        if (playSound) {
          // You can add audio here if needed
          // const audio = new Audio('/typing-sound.mp3');
          // audio.volume = 0.1;
          // audio.play().catch(() => {}); // Ignore errors if audio fails
        }
      }, currentIndex === 0 ? delay : speed);

      return () => clearTimeout(timeout);
    } else if (!isTypingComplete) {
      setIsTypingComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, text, delay, speed, onComplete, playSound, isTypingComplete]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ 
            duration: 0.8, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="ml-1"
          style={{ color: cursorColor }}
        >
          |
        </motion.span>
      )}
    </span>
  );
}

interface AnimatedTextProps {
  text: string;
  variant?: "fadeIn" | "slideUp" | "typewriter";
  delay?: number;
  duration?: number;
  className?: string;
}

export function AnimatedText({
  text,
  variant = "fadeIn",
  delay = 0,
  duration = 0.5,
  className = ""
}: AnimatedTextProps) {
  if (variant === "typewriter") {
    return <TypewriterText text={text} delay={delay * 1000} className={className} />;
  }

  const variants = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    slideUp: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }
  };

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={variants[variant]}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {text}
    </motion.span>
  );
}

// Rotating Quotes Animation Component
interface RotatingQuotesProps {
  quotes: string[];
  interval?: number;
  className?: string;
  typewriterSpeed?: number;
}

export function RotatingQuotes({
  quotes,
  interval = 4000,
  className = "",
  typewriterSpeed = 50
}: RotatingQuotesProps) {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (quotes.length <= 1) return;

    const timer = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
        setIsVisible(true);
      }, 500); // Half second fade out before changing text
    }, interval);

    return () => clearInterval(timer);
  }, [quotes.length, interval]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={currentQuoteIndex}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={className}
        >
          <TypewriterText
            text={quotes[currentQuoteIndex]}
            speed={typewriterSpeed}
            showCursor={false}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}