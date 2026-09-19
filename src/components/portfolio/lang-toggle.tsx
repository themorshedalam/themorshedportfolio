"use client";

import { useLang } from "@/lib/lang-context";

/**
 * Language toggle — EN | AR
 * Defaults to English, persists to localStorage.
 */
export function LangToggle() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center gap-1 rounded-full border border-[var(--rule)] px-1 py-0.5">
      <button
        onClick={() => setLang("en")}
        className={`font-mono-label rounded-full px-2 py-0.5 text-[10px] tracking-[0.02em] transition-colors ${
          lang === "en" ? "bg-foreground text-[var(--cream)]" : "text-foreground/45 hover:text-foreground"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("ar")}
        className={`font-mono-label rounded-full px-2 py-0.5 text-[10px] tracking-[0.02em] transition-colors ${
          lang === "ar" ? "bg-foreground text-[var(--cream)]" : "text-foreground/45 hover:text-foreground"
        }`}
      >
        ع
      </button>
    </div>
  );
}
