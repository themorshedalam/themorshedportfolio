"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { profile } from "@/lib/projects";

type Props = {
  onComplete: () => void;
};

/** How long the logo card holds before auto-dismissing, in ms */
const HOLD_MS = 800;

/**
 * Minimal title-card intro. Just the "MA — Studio" wordmark centered on
 * solid white for ~1 second, then it fades out to reveal the app.
 * No slide, no quote phase — a clean fade in and a fade out.
 */
export function IntroOverlay({ onComplete }: Props) {
  useEffect(() => {
    const t = setTimeout(onComplete, HOLD_MS);
    const skip = () => onComplete();
    window.addEventListener("keydown", skip);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", skip);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onClick={onComplete}
      className="fixed inset-0 z-[90] flex cursor-pointer flex-col items-center justify-center bg-[var(--cream)] text-foreground"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-1.5"
      >
        <div className="flex items-baseline gap-2">
          <span className="font-mono-label text-[clamp(1.2rem,2.8vw,1.75rem)] tracking-[0.04em] text-foreground font-medium">
            Morshed Alam
          </span>
          <span className="font-mono-label text-[clamp(1.2rem,2.8vw,1.75rem)] tracking-[0.04em] text-foreground/40">
            — Studio
          </span>
        </div>
        <span className="font-mono-label text-[10px] uppercase tracking-[0.24em] text-[var(--meta)]">
          Animator and Designer • Dubai
        </span>
      </motion.div>
    </motion.div>
  );
}
