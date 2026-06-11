"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ArrowDown, Code, Palette, Rocket } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const isRtl = locale === "fa";

  const stats = [
    { icon: Code, label: t("stats.projects.label"), value: t("stats.projects.value") },
    { icon: Palette, label: t("stats.technologies.label"), value: t("stats.technologies.value") },
    { icon: Rocket, label: t("stats.experience.label"), value: t("stats.experience.value") },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Gradient orbs */}
      <div className="orb w-96 h-96 bg-purple-600 -top-48 -left-48" />
      <div className="orb w-80 h-80 bg-cyan-500 bottom-0 right-0" style={{ animationDelay: "-3s" }} />
      <div className="orb w-64 h-64 bg-purple-400 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: "-5s" }} />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(rgba(124,58,237,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 text-center">
        {/* Availability badge */}
        <ScrollReveal direction="scale" delay={0}>
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-sm font-medium text-green-400 mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="badge-pulse absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            {t("available")}
          </motion.div>
        </ScrollReveal>

        {/* Main heading */}
        <ScrollReveal delay={0.15}>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            <span className="gradient-text">{t("greeting")}</span>
          </h1>
        </ScrollReveal>

        {/* Subtitle */}
        <ScrollReveal delay={0.3}>
          <p className="mt-6 text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}{" "}
            <span className="text-purple-400 font-mono">{t("tech.nextjs")}</span>{isRtl ? "، " : ", "}
            <span className="text-cyan-400 font-mono">{t("tech.react")}</span>{" "}
            {t("tech.and")}{" "}
            <span className="text-purple-400 font-mono">TypeScript</span>.
          </p>
        </ScrollReveal>

        {/* CTA Buttons */}
        <ScrollReveal delay={0.45} direction="scale">
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="#projects"
              className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-shadow hover:shadow-purple-500/40"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {t("cta.viewWork")}
              <ArrowDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
            </motion.a>
            <motion.a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 dark:border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-300 hover:border-purple-500/50 hover:text-white transition-colors"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {t("cta.getInTouch")}
            </motion.a>
          </div>
        </ScrollReveal>

        {/* Stat cards */}
        <ScrollReveal delay={0.6}>
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass-card rounded-2xl p-5 text-center"
                style={{
                  background: "var(--card)",
                  backdropFilter: "blur(16px) saturate(180%)",
                  WebkitBackdropFilter: "blur(16px) saturate(180%)",
                  borderColor: "var(--card-border)",
                }}
                whileHover={{ y: -8, rotateX: 5, rotateY: -5 }}
                initial={{ rotateX: 0, rotateY: 0 }}
              >
                <stat.icon
                  size={24}
                  className="mx-auto mb-2 text-purple-400"
                />
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs font-mono text-zinc-500 mt-1 uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown size={20} className="mx-auto text-zinc-600" />
        </motion.div>
      </div>
    </section>
  );
}
