import { motion } from "framer-motion";
import { ReactNode } from "react";

interface HoverEffectProps {
  children: ReactNode;
  scale?: number;
  rotateX?: number;
  rotateY?: number;
  className?: string;
}

export function HoverEffect({
  children,
  scale = 1.05,
  rotateX = 0,
  rotateY = 0,
  className = ""
}: HoverEffectProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ 
        scale, 
        rotateX, 
        rotateY,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
}

interface FloatingElementProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  yOffset?: number;
  className?: string;
}

export function FloatingElement({
  children,
  duration = 3,
  delay = 0,
  yOffset = 10,
  className = ""
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-yOffset, yOffset, -yOffset],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}

interface PulseEffectProps {
  children: ReactNode;
  scale?: [number, number];
  duration?: number;
  className?: string;
}

export function PulseEffect({
  children,
  scale = [1, 1.1],
  duration = 2,
  className = ""
}: PulseEffectProps) {
  return (
    <motion.div
      className={className}
      animate={{
        scale: scale
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}

interface ShakeEffectProps {
  children: ReactNode;
  trigger?: boolean;
  intensity?: number;
  className?: string;
}

export function ShakeEffect({
  children,
  trigger = false,
  intensity = 10,
  className = ""
}: ShakeEffectProps) {
  return (
    <motion.div
      className={className}
      animate={trigger ? {
        x: [-intensity, intensity, -intensity, intensity, 0],
      } : {}}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

interface GlowEffectProps {
  children: ReactNode;
  glowColor?: string;
  intensity?: string;
  className?: string;
}

export function GlowEffect({
  children,
  glowColor = "blue",
  intensity = "md",
  className = ""
}: GlowEffectProps) {
  const glowIntensities = {
    sm: "0 0 5px",
    md: "0 0 15px",
    lg: "0 0 25px",
    xl: "0 0 35px"
  };

  return (
    <motion.div
      className={className}
      whileHover={{
        filter: `drop-shadow(${glowIntensities[intensity]} currentColor)`,
        transition: { duration: 0.3 }
      }}
      style={{ color: glowColor }}
    >
      {children}
    </motion.div>
  );
}