"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { quranVerses } from "@/lib/quran-verses";

/**
 * Rotating Quran verse — English only, centered in header.
 * Changes every 10 seconds. Desktop only.
 */
export function QuranVerse() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % quranVerses.length);
    }, 10000);
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
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center max-w-[400px]"
        >
          <p className="font-mono-label text-[11px] leading-[1.3] text-foreground/70 text-center">
            {verse.english}
          </p>
          <p className="font-mono-label mt-0.5 text-[8px] uppercase tracking-[0.12em] text-[var(--meta)]">
            {verse.reference}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
