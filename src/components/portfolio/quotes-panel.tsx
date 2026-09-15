"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { designQuotes } from "@/lib/projects";

type Props = {
  active: boolean;
  intervalMs?: number;
};

/**
 * Right panel — showreel video (large, autoplay, loop, muted, no controls)
 * at top, small rotating quote at bottom.
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
      {/* Showreel video — bigger, higher up */}
      <div className="flex items-start justify-center px-6 pt-4 pb-0 md:px-10">
        <div className="w-full max-w-[1100px]">
          <div className="font-mono-label mb-2 text-[10px] uppercase tracking-[0.24em] text-[var(--meta)]">
            Showreel
          </div>
          {/* Mobile: GIF banner above showreel */}
          <img
            src="/projects/showreel-banner.gif"
            alt="Showreel banner"
            className="mb-4 block w-full max-w-[400px] h-auto rounded-2xl border border-[var(--rule)] mx-auto md:hidden"
          />
          {/* Showreel video */}
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
      </div>

      {/* Quote — smaller, closer to video, no border line */}
      <div className="px-8 pt-8 pb-4 md:px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <p className="font-serif-display text-balance text-[clamp(1.3rem,3vw,1.3rem)] md:text-[clamp(0.95rem,1.6vw,1.3rem)] leading-[1.35] text-foreground/70">
              &ldquo;{quote.text}&rdquo;
            </p>
            <p className="font-mono-label mt-1.5 text-[11px] uppercase tracking-[0.24em] text-[var(--meta)] md:text-[9px]">
              {quote.author}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
