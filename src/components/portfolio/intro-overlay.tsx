"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { profile } from "@/lib/projects";

type Props = {
  onComplete: () => void;
};

/** How long the logo card holds before auto-dismissing, in ms */
const HOLD_MS = 2400;

/**
 * Intro overlay:
 * - Middle: The signature 3D heart animation in standard size
 * - Bottom: "MA — Studio" wordmark in small standard size
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
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onClick={onComplete}
      className="fixed inset-0 z-[90] flex cursor-pointer flex-col items-center justify-center bg-[var(--cream)] text-foreground select-none"
    >
      {/* Middle: Heart animation (2x bigger, no background oval, no shadow) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex items-center justify-center"
      >
        <img
          src="/projects/chatbot-heart.gif"
          alt="MA Studio"
          width={180}
          height={180}
          className="h-36 w-36 sm:h-44 sm:w-44 object-contain mix-blend-multiply"
          loading="eager"
        />
      </motion.div>

      {/* Bottom: MA — Studio in small standard size */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-8 sm:bottom-12 inset-x-0 flex items-center justify-center gap-2 font-mono-label text-[11px] sm:text-[12px] tracking-[0.16em] uppercase text-foreground/60"
      >
        <span className="font-semibold text-foreground/80">
          {profile.studio.split(" — ")[0]}
        </span>
        <span className="text-foreground/30">—</span>
        <span>
          {profile.studio.split(" — ")[1]}
        </span>
      </motion.div>
    </motion.div>
  );
}
