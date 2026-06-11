"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { startTransition } from "react";

export function LocaleToggle() {
  const locale = useLocale();
  const pathname = usePathname();

  const toggleLocale = () => {
    const next = locale === "en" ? "fa" : "en";
    // Persist choice for next visit (middleware reads NEXT_LOCALE cookie)
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000`;

    // Navigate to the same path with new locale prefix
    startTransition(() => {
      const newPath = pathname.replace(/^\/(en|fa)/, `/${next}`);
      window.location.href = newPath;
    });
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold font-mono text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors border border-zinc-800"
      aria-label={locale === "en" ? "Switch to Persian" : "Switch to English"}
    >
      <Languages size={14} />
      {locale === "en" ? "FA" : "EN"}
    </button>
  );
}
