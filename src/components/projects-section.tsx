"use client";

import { useEffect, useState } from "react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { motion } from "framer-motion";
import { ExternalLink, GitFork, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase";
import { CardSkeleton } from "@/components/skeleton";
import type { Project } from "@/types/database";

export function ProjectsSection() {
  const t = useTranslations("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("projects")
          .select("*")
          .eq("featured", true)
          .order("sort_order", { ascending: true });
        setProjects((data as Project[]) || []);
      } catch {
        // Silently fail
      }
      setLoading(false);
    }
    fetchProjects();
  }, []);

  // Map DB level (1-5) to percentage for progress bars
  const accentColors = [
    "from-amber-500 to-yellow-600",
    "from-cyan-500 to-blue-600",
    "from-purple-500 to-pink-600",
    "from-green-500 to-emerald-600",
    "from-rose-500 to-red-600",
  ];
  const accentHexes = ["#f59e0b", "#06b6d4", "#7c3aed", "#22c55e", "#f43f5e"];

  return (
    <section id="projects" className="relative py-32 overflow-hidden">
      <div className="orb w-72 h-72 bg-purple-600 top-20 -right-36" style={{ animationDelay: "-2s" }} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block font-mono text-xs uppercase tracking-widest text-purple-400 mb-3">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading
            ? [0, 1, 2].map((i) => <CardSkeleton key={i} />)
            : projects.map((project, i) => {
                const gradient = accentColors[i % accentColors.length];
                const accent = accentHexes[i % accentHexes.length];
                return (
                  <ScrollReveal key={project.id} delay={i * 0.15} direction="scale">
                    <motion.div
                      className="glass-card group rounded-3xl p-6 sm:p-8 relative overflow-hidden"
                      style={{
                        background: "var(--card)",
                        backdropFilter: "blur(16px) saturate(180%)",
                        WebkitBackdropFilter: "blur(16px) saturate(180%)",
                        borderColor: "var(--card-border)",
                      }}
                      whileHover={{ y: -10 }}
                    >
                      {/* Gradient accent bar */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />

                      {/* Project header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}88)` }}
                          >
                            {project.title.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-zinc-100 dark:text-zinc-100">
                              {project.title}
                            </h3>
                            {project.featured && (
                              <span className="text-xs font-mono text-purple-400">{t("featured")}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-100 hover:bg-white/5 transition-colors"
                            >
                              <GitFork size={16} />
                            </a>
                          )}
                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-100 hover:bg-white/5 transition-colors"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Image */}
                      {project.image_url && (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-40 object-cover rounded-xl mb-4"
                        />
                      )}

                      {/* Description */}
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-5">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 text-zinc-400 border border-white/5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Hover arrow */}
                      <motion.div
                        className="absolute bottom-6 right-6 text-zinc-700 group-hover:text-purple-400 transition-colors"
                        initial={{ x: 0, y: 0 }}
                        whileHover={{ x: 4, y: -4 }}
                      >
                        <ArrowUpRight size={20} />
                      </motion.div>
                    </motion.div>
                  </ScrollReveal>
                );
              })}
        </div>
      </div>
    </section>
  );
}
