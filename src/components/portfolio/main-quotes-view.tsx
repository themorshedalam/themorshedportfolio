"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { designQuotes, profile } from "@/lib/projects";

type Props = {
  /** Rotation only starts once this is true (after the intro) */
  active: boolean;
  intervalMs?: number;
};

/**
 * Full-area rotating-quote view for the right side of the page.
 * Shows one design/animation quote at a time, centered, in large serif
 * text with the author in mono label. Crossfades to the next quote on an
 * interval. This is the default right-side state when no project is
 * selected — clicking a project fades this out and shows the project detail.
 */
export function MainQuotesView({ active, intervalMs = 5000 }: Props) {
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
    <div className="scroll-cream relative h-full overflow-y-auto bg-[var(--cream)]">
      <div className="mx-auto flex min-h-full max-w-[900px] flex-col items-center justify-center px-6 py-20 text-center md:px-12">
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="font-mono-label mb-12 flex items-center gap-3 text-[11px] uppercase tracking-[0.44em] text-[var(--meta)]"
        >
          <span className="h-1 w-1 rounded-full bg-foreground" />
          <span>Quotes on Design &amp; Animation</span>
        </motion.div>

        {/* Rotating quote */}
        <div className="relative min-h-[180px] w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex flex-col items-center"
            >
              <p className="font-serif-display text-balance text-[clamp(1.5rem,4vw,2.75rem)] leading-[1.3] text-foreground/85">
                &ldquo;{quote.text}&rdquo;
              </p>
              <p className="font-mono-label mt-8 text-[12px] uppercase tracking-[0.44em] text-[var(--meta)]">
                {quote.author}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress dots — one per quote, current highlighted */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-mono-label mt-16 flex items-center gap-2"
        >
          {designQuotes.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === index
                  ? "w-6 bg-foreground"
                  : "w-1 bg-foreground/20"
              }`}
            />
          ))}
        </motion.div>

        {/* Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="font-mono-label mt-10 text-[10px] uppercase tracking-[0.24em] text-[var(--meta)]"
        >
          Select a project from the index →
        </motion.div>
      </div>
    </div>
  );
}
