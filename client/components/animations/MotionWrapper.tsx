import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

interface MotionWrapperProps {
  children: ReactNode;
  variant?: "fadeIn" | "slideUp" | "slideLeft" | "slideRight" | "scale" | "stagger";
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

const variants: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  slideUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  },
  slideLeft: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  },
  slideRight: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  stagger: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }
};

export function MotionWrapper({
  children,
  variant = "fadeIn",
  delay = 0,
  duration = 0.5,
  className,
  once = true
}: MotionWrapperProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-100px" }}
      variants={variants[variant]}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function MotionContainer({
  children,
  className,
  staggerChildren = 0.1
}: {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}