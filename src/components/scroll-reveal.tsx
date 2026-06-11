"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale" | "none";
  once?: boolean;
}

const directionOffsets: Record<string, { y: number; x: number; scale: number; opacity: number }> = {
  up: { y: 80, x: 0, scale: 1, opacity: 0 },
  down: { y: -80, x: 0, scale: 1, opacity: 0 },
  left: { y: 0, x: 80, scale: 1, opacity: 0 },
  right: { y: 0, x: -80, scale: 1, opacity: 0 },
  scale: { y: 0, x: 0, scale: 0.85, opacity: 0 },
  none: { y: 0, x: 0, scale: 1, opacity: 1 },
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-80px 0px" });
  const offset = directionOffsets[direction];

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={offset}
      animate={
        inView
          ? { y: 0, x: 0, scale: 1, opacity: 1 }
          : offset
      }
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
