"use client";

import { useTheme } from "@/lib/theme-provider";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 focus-visible:ring-offset-zinc-100 transition-colors duration-500"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)"
          : "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Sliding pill background */}
      <motion.div
        className="absolute inset-1 rounded-full"
        animate={{
          x: isDark ? 0 : 32,
          background: isDark
            ? "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)"
            : "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
      />

      {/* Stars (visible in dark mode) */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute w-0.5 h-0.5 rounded-full bg-white"
          animate={{
            opacity: isDark ? [0, 1, 0.3, 1, 0] : 0,
            scale: isDark ? [0, 1.5, 0.5, 1.2, 0] : 0,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeInOut",
          }}
          style={{
            left: `${20 + i * 25}%`,
            top: `${30 + (i % 2) * 30}%`,
          }}
        />
      ))}

      {/* Sun rays (visible in light mode) */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`ray-${i}`}
          className="absolute w-0.5 h-1.5 rounded-full origin-bottom"
          style={{
            left: "50%",
            top: "50%",
            background: "#fbbf24",
            transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-10px)`,
          }}
          animate={{
            opacity: !isDark ? 0.6 : 0,
            scale: !isDark ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}

      {/* Moon icon */}
      <motion.div
        className="absolute left-1.5 top-1.5 text-white"
        animate={{
          opacity: isDark ? 1 : 0,
          rotate: isDark ? 0 : -90,
          scale: isDark ? 1 : 0.5,
        }}
        transition={{ duration: 0.3 }}
      >
        <Moon size={18} strokeWidth={2} />
      </motion.div>

      {/* Sun icon */}
      <motion.div
        className="absolute right-1.5 top-1.5 text-amber-900"
        animate={{
          opacity: !isDark ? 1 : 0,
          rotate: !isDark ? 0 : 90,
          scale: !isDark ? 1 : 0.5,
        }}
        transition={{ duration: 0.3 }}
      >
        <Sun size={18} strokeWidth={2} />
      </motion.div>

      {/* Sparkle particles on transition */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: isDark
            ? "radial-gradient(circle at 30% 50%, rgba(124,58,237,0.15) 0%, transparent 60%)"
            : "radial-gradient(circle at 70% 50%, rgba(245,158,11,0.15) 0%, transparent 60%)",
        }}
        transition={{ duration: 0.6 }}
      />
    </button>
  );
}
