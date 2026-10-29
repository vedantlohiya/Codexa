import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Smooth Page Transition Wrapper with subtle upward motion and opacity
export const PageTransition: React.FC<{ children: React.ReactNode; keyId?: string; className?: string }> = ({
  children,
  keyId,
  className = 'w-full',
}) => {
  return (
    <motion.div
      key={keyId}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger Container for cards with crisp 0.05s delay
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.06,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animated Card with Entrance and subtle Hover Lift + thin blue border highlight
export const AnimatedCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}> = ({ children, className = '', onClick, hoverEffect = true }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 8 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      whileHover={
        hoverEffect
          ? {
              y: -2,
              boxShadow: '0 10px 24px -4px rgba(24, 54, 83, 0.08), 0 4px 10px -2px rgba(59, 130, 246, 0.06)',
              borderColor: 'rgba(59, 130, 246, 0.45)',
              transition: { duration: 0.2, ease: 'easeOut' },
            }
          : undefined
      }
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animated Numeric Counter (counts up smoothly to target value)
export const AnimatedCounter: React.FC<{
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}> = ({ value, duration = 0.65, suffix = '', prefix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      // easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(easeProgress * value));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
};

// Animated SVG Circular Score Ring
export const ScoreRing: React.FC<{
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  showText?: boolean;
}> = ({
  percentage,
  size = 56,
  strokeWidth = 4.5,
  color = '#14B8A6',
  trackColor = '#E2E8F0',
  showText = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center font-mono font-semibold text-xs text-[#172033]">
          <AnimatedCounter value={percentage} suffix="%" />
        </div>
      )}
    </div>
  );
};

// Subtle Pulsing Indicator for Live Sessions / Metrics
export const PulsingSessionBadge: React.FC<{ label?: string }> = ({
  label = 'Simulated Session Active',
}) => {
  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#EAF4FF] border border-[#CBD5E1] text-xs font-medium text-[#183653]">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14B8A6] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14B8A6]" />
      </span>
      <span>{label}</span>
    </div>
  );
};

export { AnimatePresence, motion };
