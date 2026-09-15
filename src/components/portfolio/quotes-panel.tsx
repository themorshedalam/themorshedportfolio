"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { designQuotes } from "@/lib/projects";

type Props = {
  /** Rotation only starts once this is true (i.e. after the intro) */
  active: boolean;
  /** Interval in ms between quote changes */
  intervalMs?: number;
};

/**
 * Right panel — showreel video at top, rotating design quote below.
 */
export function QuotesPanel({ active, intervalMs = 5000 }: Props) {
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * designQuotes.length)
  );
  const timer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!active) return;
    timer.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % designQuotes.length);
    }, intervalMs);
    return () => clearInterval(timer.current);
  }, [active, intervalMs]);

  const quote = designQuotes[index];

  return (
    <div className="flex h-full flex-col bg-[var(--cream)]">
      {/* Showreel video — top */}
      <div className="border-b border-[var(--rule)] px-8 pt-6 pb-5 md:px-12">
        <div className="font-mono-label mb-3 text-[10px] uppercase tracking-[0.24em] text-[var(--meta)]">
          Showreel
        </div>
        <video
          src="/projects/showreel.mp4"
          controls
          playsInline
          preload="metadata"
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
          className="block w-full h-auto rounded-2xl border border-[var(--rule)]"
        />
      </div>

      {/* Quote — centered below */}
      <div className="flex flex-1 items-center justify-center px-8 md:px-12 lg:px-16 py-10">
        <div className="relative w-full max-w-[640px] min-h-[140px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-serif-display text-balance text-center text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.25] text-foreground/85">
                &ldquo;{quote.text}&rdquo;
              </p>
              <p className="font-mono-label mt-6 text-center text-[11px] uppercase tracking-[0.44em] text-[var(--meta)]">
                {quote.author}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
