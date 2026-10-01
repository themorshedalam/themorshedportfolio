"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

type Props = {
  onComplete: () => void;
};

/** How long the logo holds before auto-dismissing, in ms */
const HOLD_MS = 1500;

/**
 * Intro overlay:
 * - Minimalist centered "MA- Studio" wordmark
 * Any click or keypress skips immediately.
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
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onClick={onComplete}
      className="fixed inset-0 z-[90] flex cursor-pointer flex-col items-center justify-center bg-[var(--cream)] text-foreground select-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-2 font-mono-label text-[15px] sm:text-[17px] tracking-[0.18em] uppercase"
      >
        <span className="font-semibold text-foreground">MA</span>
        <span className="text-foreground/40">—</span>
        <span className="text-foreground/80">Studio</span>
      </motion.div>
    </motion.div>
  );
}
