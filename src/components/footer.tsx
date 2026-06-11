"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="relative border-t border-zinc-800/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="gradient-text font-bold">Abolfazl DoStGol</span>
            <span className="text-zinc-600 text-sm">{t("copyright")} {new Date().getFullYear()}</span>
          </div>

          <p className="text-sm text-zinc-600 font-mono">
            {t("builtWith")} <span className="text-purple-400">Next.js</span> {t("and")}{" "}
            <span className="text-cyan-400">Framer Motion</span>
          </p>

          <motion.p
            className="text-xs text-zinc-700"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t("designedWith")} 💜
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
