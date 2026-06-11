"use client";

import { useEffect, useState } from "react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase";
import { SkillCardSkeleton } from "@/components/skeleton";
import type { Skill } from "@/types/database";

const categoryIcons: Record<string, string> = {
  frontend: "🎨",
  backend: "⚙️",
  devops: "🗄️",
  design: "🎯",
  tools: "🔧",
};

const categoryLabels: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  devops: "Database & Tools",
  design: "Design",
  tools: "Tools",
};

export function SkillsSection() {
  const t = useTranslations("skills");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("skills")
          .select("*")
          .order("sort_order", { ascending: true });
        setSkills((data as Skill[]) || []);
      } catch {
        // Silently fail
      }
      setLoading(false);
    }
    fetchSkills();
  }, []);

  // Group skills by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const categories = Object.entries(grouped).sort(([a], [b]) => {
    const order = ["frontend", "backend", "devops", "design", "tools"];
    return order.indexOf(a) - order.indexOf(b);
  });

  return (
    <section id="skills" className="relative py-32 overflow-hidden">
      <div className="orb w-80 h-80 bg-cyan-500 -bottom-40 left-1/2 -translate-x-1/2" style={{ animationDelay: "-4s" }} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block font-mono text-xs uppercase tracking-widest text-cyan-400 mb-3">
              // {t("label")}
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold">
              <span className="gradient-text">{t("title")}</span>
            </h2>
            <p className="mt-4 text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              {t("subtitle")}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? [0, 1, 2].map((i) => <SkillCardSkeleton key={i} />)
            : categories.map(([category, catSkills], gi) => (
                <ScrollReveal key={category} delay={gi * 0.15}>
                  <motion.div
                    className="glass-card rounded-3xl p-6 h-full"
                    style={{
                      background: "var(--card)",
                      backdropFilter: "blur(16px) saturate(180%)",
                      WebkitBackdropFilter: "blur(16px) saturate(180%)",
                      borderColor: "var(--card-border)",
                    }}
                    whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-2xl">
                        {categoryIcons[category] || "💡"}
                      </span>
                      <h3 className="text-lg font-bold text-zinc-100">
                        {categoryLabels[category] || category}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {catSkills.map((skill, si) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: gi * 0.15 + si * 0.08 }}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-mono text-zinc-400">
                              {skill.icon && <span className="mr-1">{skill.icon}</span>}
                              {skill.name}
                            </span>
                            <span className="text-xs font-mono text-zinc-600">
                              {skill.level * 20}%
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-zinc-800/50 dark:bg-zinc-800/50 overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level * 20}%` }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 1,
                                delay: gi * 0.15 + si * 0.08,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
        </div>
      </div>
    </section>
  );
}
