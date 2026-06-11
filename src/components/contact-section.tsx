"use client";

import { ScrollReveal } from "@/components/scroll-reveal";
import { motion } from "framer-motion";
import { Mail, Send, GitFork, Link, Send as TelegramIcon, Loader2, CheckCircle } from "lucide-react";
import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

export function ContactSection() {
  const t = useTranslations("contact");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "خطا در ارسال پیام");
        return;
      }

      setSubmitted(true);
      toast.success("پیام شما با موفقیت ارسال شد!");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      toast.error("خطا در ارسال پیام. دوباره تلاش کنید");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      <div className="orb w-96 h-96 bg-cyan-500 -bottom-48 right-0" style={{ animationDelay: "-1s" }} />
      <div className="orb w-64 h-64 bg-purple-500 top-1/4 left-1/4" style={{ animationDelay: "-3s" }} />

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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Contact info */}
          <ScrollReveal className="lg:col-span-2">
            <div className="space-y-6">
              <div
                className="glass-card rounded-2xl p-6"
                style={{
                  background: "var(--card)",
                  backdropFilter: "blur(16px) saturate(180%)",
                  WebkitBackdropFilter: "blur(16px) saturate(180%)",
                  borderColor: "var(--card-border)",
                }}
              >
                <h3 className="text-lg font-bold text-zinc-100 mb-4">{t("connect")}</h3>
                <div className="space-y-4">
                  <a
                    href="mailto:abol777dev@gmail.com"
                    className="flex items-center gap-3 text-zinc-400 hover:text-purple-400 transition-colors group"
                  >
                    <Mail size={18} />
                    <span className="text-sm font-mono">abol777dev@gmail.com</span>
                  </a>
                  <a
                    href="https://github.com/MrAbol777"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-zinc-400 hover:text-purple-400 transition-colors group"
                  >
                    <GitFork size={18} />
                    <span className="text-sm font-mono">{t("github")}</span>
                  </a>
                  <a
                    href="https://linkedin.com/in/abolfazl-dostgol"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-zinc-400 hover:text-purple-400 transition-colors group"
                  >
                    <Link size={18} />
                    <span className="text-sm font-mono">{t("linkedin")}</span>
                  </a>
                  <a
                    href="https://t.me/Abol777"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-zinc-400 hover:text-purple-400 transition-colors group"
                  >
                    <TelegramIcon size={18} />
                    <span className="text-sm font-mono">@Abol777</span>
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Contact form */}
          <ScrollReveal className="lg:col-span-3" delay={0.15}>
            <form
              onSubmit={handleSubmit}
              className="glass-card rounded-3xl p-6 sm:p-8"
              style={{
                background: "var(--card)",
                backdropFilter: "blur(16px) saturate(180%)",
                WebkitBackdropFilter: "blur(16px) saturate(180%)",
                borderColor: "var(--card-border)",
              }}
            >
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-mono text-zinc-400 mb-2">
                    {t("form.name.label")}
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-colors"
                    placeholder={t("form.name.placeholder")}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-mono text-zinc-400 mb-2">
                    {t("form.email.label")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-colors"
                    placeholder={t("form.email.placeholder")}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-mono text-zinc-400 mb-2">
                    {t("form.message.label")}
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-colors resize-none"
                    placeholder={t("form.message.placeholder")}
                  />
                </div>
                <motion.button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-shadow disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={submitting || submitted}
                >
                  {submitted ? (
                    <>
                      <CheckCircle size={16} />
                      {t("form.sent")}
                    </>
                  ) : submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      در حال ارسال...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      {t("form.send")}
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
