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
 * Right panel — a single rotating design/animation quote, big and centered,
 * with no header label or counter. The quote is the only content, scaled up
 * so it stands out. Crossfades to the next quote on an interval. Rotation
 * starts only when `active` is true (after the intro).
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
    <div className="flex h-full items-center justify-center bg-[var(--cream)] px-8 md:px-12 lg:px-16">
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
  );
}
