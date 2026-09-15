"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { designQuotes } from "@/lib/projects";

type Props = {
  active: boolean;
  intervalMs?: number;
};

/**
 * Right panel — showreel video (large, ~75% height) at top,
 * small rotating quote at bottom.
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
      {/* Showreel video — large, takes most of the space */}
      <div className="flex flex-1 items-center justify-center px-8 pt-6 md:px-12">
        <div className="w-full max-w-[900px]">
          <div className="font-mono-label mb-3 text-[10px] uppercase tracking-[0.24em] text-[var(--meta)]">
            Showreel
          </div>
          <video
            src="/projects/showreel.mp4"
            controls
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            controlsList="nodownload nofullscreen noremoteplayback"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
            className="block w-full h-auto rounded-2xl border border-[var(--rule)]"
          />
        </div>
      </div>

      {/* Quote — small at bottom */}
      <div className="border-t border-[var(--rule)] px-8 py-4 md:px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <p className="font-serif-display text-balance text-[clamp(0.95rem,1.8vw,1.25rem)] leading-[1.4] text-foreground/70">
              &ldquo;{quote.text}&rdquo;
            </p>
            <p className="font-mono-label mt-2 text-[10px] uppercase tracking-[0.24em] text-[var(--meta)]">
              {quote.author}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
