import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

interface CountingNumberProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  decimals?: number;
  enableGlow?: boolean;
  enableBounce?: boolean;
}

export function CountingNumber({
  end,
  start = 0,
  duration = 2,
  delay = 0,
  suffix = "",
  prefix = "",
  className = "",
  decimals = 0
}: CountingNumberProps) {
  const [count, setCount] = useState(start);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        let startTime: number;
        const animateCount = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const progress = (timestamp - startTime) / (duration * 1000);
          
          if (progress < 1) {
            const currentCount = start + (end - start) * easeOutQuart(progress);
            setCount(Number(currentCount.toFixed(decimals)));
            requestAnimationFrame(animateCount);
          } else {
            setCount(end);
          }
        };
        requestAnimationFrame(animateCount);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [inView, start, end, duration, delay, decimals]);

  // Easing function for smooth animation
  const easeOutQuart = (t: number): number => {
    return 1 - Math.pow(1 - t, 4);
  };

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      {prefix}{count.toLocaleString()}{suffix}
    </motion.span>
  );
}

interface StatsCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  description?: string;
  icon?: React.ReactNode;
  delay?: number;
}

export function AnimatedStatsCard({
  title,
  value,
  suffix = "",
  prefix = "",
  description,
  icon,
  delay = 0
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.05 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {icon && <div className="text-blue-400">{icon}</div>}
      </div>
      <div className="text-3xl font-bold text-white mb-2">
        <CountingNumber
          end={value}
          duration={2}
          delay={delay + 0.3}
          suffix={suffix}
          prefix={prefix}
        />
      </div>
      {description && (
        <p className="text-gray-400 text-sm">{description}</p>
      )}
    </motion.div>
  );
}