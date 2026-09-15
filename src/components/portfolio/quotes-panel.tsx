"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { designQuotes, projects } from "@/lib/projects";

type Props = {
  /** Rotation only starts once this is true (i.e. after the intro) */
  active: boolean;
  /** Interval in ms between quote changes */
  intervalMs?: number;
  /** Called when a project thumbnail is clicked */
  onPickProject?: (id: string) => void;
};

/**
 * Right panel — a single rotating design/animation quote, big and centered,
 * with project preview thumbnails below. Crossfades to the next quote on an
 * interval. Rotation starts only when `active` is true (after the intro).
 */
export function QuotesPanel({ active, intervalMs = 5000, onPickProject }: Props) {
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
  const featured = projects.filter((p) => p.featured).slice(0, 4);

  return (
    <div className="flex h-full flex-col bg-[var(--cream)]">
      {/* Quote — centered in the upper portion */}
      <div className="flex flex-1 items-center justify-center px-8 md:px-12 lg:px-16 pt-16">
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

      {/* Project preview thumbnails — bottom strip */}
      {onPickProject && featured.length > 0 && (
        <div className="border-t border-[var(--rule)] px-8 py-6 md:px-12 lg:px-16">
          <div className="font-mono-label mb-4 text-[10px] uppercase tracking-[0.24em] text-[var(--meta)]">
            Selected Work
          </div>
          <div className="grid grid-cols-4 gap-3">
            {featured.map((p, i) => (
              <motion.button
                key={p.id}
                onClick={() => onPickProject(p.id)}
                data-cursor="view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                className="group text-left"
              >
                <div className="relative mb-2 overflow-hidden rounded-lg border border-[var(--rule)] bg-[var(--cream-soft)]">
                  {p.images[0]?.src || p.videos?.[0]?.src ? (
                    <img
                      src={p.images[0]?.src || p.videos?.[0]?.src}
                      alt={p.title}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                  ) : (
                    <div className="aspect-[4/3] w-full bg-[var(--cream-deep)]" />
                  )}
                </div>
                <div className="font-mono-label truncate text-[10px] uppercase tracking-[0.08em] text-foreground/60 transition-colors group-hover:text-foreground">
                  {p.title}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
