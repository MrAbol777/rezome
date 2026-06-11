"use client";

import { useEffect, useState } from "react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";
import { useLocale } from "next-intl";
import { createClient } from "@/lib/supabase";
import { ExperienceCardSkeleton } from "@/components/skeleton";
import type { Experience } from "@/types/database";

export function ExperienceSection() {
  const locale = useLocale();
  const isRtl = locale === "fa";
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("experiences")
          .select("*")
          .order("sort_order", { ascending: true });
        setExperiences((data as Experience[]) || []);
      } catch {
        // Silently fail
      }
      setLoading(false);
    }
    fetchExperiences();
  }, []);

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    if (locale === "fa") {
      return d.toLocaleDateString("fa-IR", { year: "numeric" });
    }
    return d.toLocaleDateString("en-US", { year: "numeric" });
  }

  return (
    <section id="experience" className="relative py-32 overflow-hidden">
      <div className="orb w-64 h-64 bg-purple-500 top-1/3 -left-32" style={{ animationDelay: "-6s" }} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block font-mono text-xs uppercase tracking-widest text-purple-400 mb-3">
              // experience
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold">
              <span className="gradient-text">تجربه‌ها</span>
            </h2>
            <p className="mt-4 text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              جایی که مشارکت کردم و به عنوان توسعه‌دهنده رشد کردم.
            </p>
          </div>
        </ScrollReveal>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          <div className={`absolute top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-cyan-500/50 to-transparent ${isRtl ? "right-4 sm:right-8" : "left-4 sm:left-8"}`} />

          <div className="space-y-8">
            {loading
              ? [0, 1, 2].map((i) => (
                  <ScrollReveal key={i} delay={i * 0.15}>
                    <div className={`relative ${isRtl ? "pr-12 sm:pr-20" : "pl-12 sm:pl-20"}`}>
                      <ExperienceCardSkeleton />
                    </div>
                  </ScrollReveal>
                ))
              : experiences.map((exp, i) => (
                  <ScrollReveal key={exp.id} delay={i * 0.15}>
                    <motion.div
                      className={`relative ${isRtl ? "pr-12 sm:pr-20" : "pl-12 sm:pl-20"}`}
                      whileHover={{ x: isRtl ? -4 : 4 }}
                    >
                      {/* Timeline dot */}
                      <div className={`absolute top-8 ${isRtl ? "right-2.5 sm:right-6.5" : "left-2.5 sm:left-6.5"}`}>
                        <motion.div
                          className={`w-3 h-3 rounded-full ${exp.is_current ? "bg-green-400 badge-pulse" : "bg-purple-500"}`}
                          whileHover={{ scale: 1.5 }}
                        />
                      </div>

                      <div
                        className="glass-card rounded-2xl p-6"
                        style={{
                          background: "var(--card)",
                          backdropFilter: "blur(16px) saturate(180%)",
                          WebkitBackdropFilter: "blur(16px) saturate(180%)",
                          borderColor: "var(--card-border)",
                        }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <Briefcase size={16} className="text-purple-400" />
                            <h3 className="text-lg font-bold text-zinc-100">{exp.role}</h3>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500">
                            <Calendar size={12} />
                            {formatDate(exp.start_date)}
                            {" — "}
                            {exp.is_current
                              ? locale === "fa"
                                ? "اکنون"
                                : "Present"
                              : exp.end_date
                                ? formatDate(exp.end_date)
                                : "—"}
                          </div>
                        </div>

                        <p className="text-sm font-medium text-cyan-400 mb-3">{exp.company}</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                          {exp.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 text-zinc-400 border border-white/5">
                            {exp.role}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 text-zinc-400 border border-white/5">
                            {exp.company}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </ScrollReveal>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
