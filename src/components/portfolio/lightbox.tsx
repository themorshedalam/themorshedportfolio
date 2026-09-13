"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

type Props = {
  src: string;
  onClose: () => void;
};

export function Lightbox({ src, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/85 backdrop-blur-md"
    >
      <button
        onClick={onClose}
        data-cursor="link"
        className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 text-[var(--cream)] transition-colors hover:bg-foreground/10"
        aria-label="Close"
      >
        ✕
      </button>
      <motion.img
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        src={src}
        alt="Expanded view"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] max-w-[92vw] rounded-xl object-contain shadow-2xl"
      />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-label-wide text-[var(--cream)]/60">
        Esc to close
      </div>
    </motion.div>
  );
}
