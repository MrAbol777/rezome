"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleToggle } from "@/components/locale-toggle";
import { ScrollReveal } from "@/components/scroll-reveal";
import { motion } from "framer-motion";
import { Menu, X, GitFork, Link } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import NextLink from "next/link";

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "#projects", label: t("projects") },
    { href: "/services", label: t("services"), external: true },
    { href: "#skills", label: t("skills") },
    { href: "#experience", label: t("experience") },
    { href: "#contact", label: t("contact") },
  ];

  const isRtl = locale === "fa";

  return (
    <motion.header
      className="fixed top-0 z-50"
      style={{ left: 0, right: 0 }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <nav className="mt-4 flex items-center justify-between rounded-2xl border px-4 py-3 glass-card"
          style={{
            background: "var(--card)",
            backdropFilter: "blur(16px) saturate(180%)",
            WebkitBackdropFilter: "blur(16px) saturate(180%)",
            borderColor: "var(--card-border)",
          }}
        >
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <span className="text-lg font-bold gradient-text">{t("logo")}</span>
            <motion.span
              className="h-5 w-5 rounded-md bg-gradient-to-br from-purple-500 to-cyan-500"
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.4 }}
            />
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const LinkTag = (link as any).external
                ? ({ children, ...props }: any) => <NextLink {...props}>{children}</NextLink>
                : "a";
              return (
                <LinkTag
                  key={link.href}
                  href={link.href}
                  className="relative px-3 py-1.5 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 h-px w-0 bg-gradient-to-r from-purple-500 to-cyan-500 group-hover:w-full group-hover:left-0 transition-all duration-300" />
                </LinkTag>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <a
                href="https://github.com/MrAbol777"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors"
              >
                <GitFork size={18} />
              </a>
              <a
                href="https://linkedin.com/in/abolfazl-dostgol"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors"
              >
                <Link size={18} />
              </a>
            </div>

            <LocaleToggle />
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <motion.div
          className="md:hidden overflow-hidden"
          animate={{ height: mobileOpen ? "auto" : 0, opacity: mobileOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mt-2 rounded-2xl border px-4 py-4 glass-card space-y-1"
            style={{
              background: "var(--card)",
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
              borderColor: "var(--card-border)",
            }}
          >
            {navLinks.map((link, i) => {
              const LinkTag = (link as any).external
                ? ({ children, ...props }: any) => <NextLink {...props}>{children}</NextLink>
                : "a";
              return (
                <motion.div
                  key={link.href}
                  initial={{ x: isRtl ? 20 : -20, opacity: 0 }}
                  animate={{ x: 0, opacity: mobileOpen ? 1 : 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <LinkTag
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors"
                  >
                    {link.label}
                  </LinkTag>
                </motion.div>
              );
            })}
            <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
              <a href="https://github.com/MrAbol777" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100">
                <GitFork size={18} />
              </a>
              <a href="https://linkedin.com/in/abolfazl-dostgol" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100">
                <Link size={18} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
