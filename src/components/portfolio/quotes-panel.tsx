"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { quranVerses } from "@/lib/quran-verses";
import { PrayerTimes } from "./prayer-times";

type Props = {
  active: boolean;
};

/**
 * Right panel — showreel video centered (desktop), 
 * Quran verse at bottom on mobile.
 */
export function QuotesPanel({ active }: Props) {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!active) return;
    timer.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % quranVerses.length);
    }, 10000);
    return () => clearInterval(timer.current);
  }, [active]);

  const verse = quranVerses[index];

  return (
    <div className="flex h-full flex-col items-center justify-center bg-[var(--cream)]">
      {/* Showreel — centered */}
      <div className="w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono-label mb-2 text-[10px] uppercase tracking-[0.24em] text-[var(--meta)]">
          Showreel
        </div>
        {/* Mobile: GIF banner above showreel */}
        <img
          src="/projects/showreel-banner.gif"
          alt="Showreel banner"
          className="mb-4 block w-full max-w-[280px] h-auto rounded-2xl mx-auto md:hidden"
        />
        <video
          src="/projects/showreel.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/projects/showreel-poster.jpg"
          onContextMenu={(e) => e.preventDefault()}
          className="block w-full h-auto rounded-2xl border border-[var(--rule)]"
        />
      </div>

      {/* Quran verse — mobile only, at bottom */}
      <div className="mt-6 px-8 pb-6 md:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <p className="font-mono-label text-[13px] leading-[1.4] text-foreground/70">
              {verse.english}
            </p>
            <p className="font-mono-label mt-1 text-[9px] uppercase tracking-[0.12em] text-[var(--meta)]">
              {verse.reference}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prayer times — mobile only, below Quran verse */}
      <div className="md:hidden">
        <PrayerTimes compact />
      </div>
    </div>
  );
}
