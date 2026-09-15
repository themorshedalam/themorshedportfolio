"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { quranVerses } from "@/lib/quran-verses";

/**
 * Rotating Quran verse display for the header center.
 * Shows: Arabic text, English translation, Surah:verse reference.
 * Changes every 1 minute with a smooth fade transition.
 * Desktop only (hidden on mobile).
 */
export function QuranVerse() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % quranVerses.length);
    }, 60000); // 1 minute
    return () => clearInterval(interval);
  }, []);

  const verse = quranVerses[index];

  return (
    <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Arabic */}
          <p
            className="text-[15px] leading-[1.6] text-foreground"
            style={{ fontFamily: "var(--font-amiri), serif", direction: "rtl" }}
          >
            {verse.arabic}
          </p>
          {/* English */}
          <p className="font-mono-label mt-0.5 text-[9px] leading-[1.3] text-foreground/50">
            {verse.english}
          </p>
          {/* Reference */}
          <p className="font-mono-label mt-0.5 text-[8px] uppercase tracking-[0.12em] text-[var(--meta)]">
            {verse.reference}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
