"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Props = {
  src: string;
  alt: string;
  className?: string;
  caption?: string;
  /** Project index used to derive a stable gradient theme */
  index?: number;
  /** Aspect ratio class, defaults to 16/9 */
  aspectClass?: string;
};

// Warm editorial gradient pairs, one per project slot
const GRADIENTS: { from: string; to: string; ink: string }[] = [
  { from: "#3a2e22", to: "#1a1410", ink: "#d9c8a8" }, // 01 amber/brandy
  { from: "#16182b", to: "#070a18", ink: "#9fb0d9" }, // 02 electric indigo
  { from: "#1d2f24", to: "#0e1812", ink: "#a8c9b8" }, // 03 resort green
  { from: "#2a1d10", to: "#150d05", ink: "#d9b48a" }, // 04 ramadan bronze
  { from: "#181e26", to: "#080b10", ink: "#a8b4c0" }, // 05 automotive steel
  { from: "#2b1417", to: "#150a0b", ink: "#d9a8ab" }, // 06 heart rose
];

export function ProjectImage({
  src,
  alt,
  className = "",
  caption,
  index = 0,
  aspectClass = "aspect-[16/9]",
}: Props) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [exists, setExists] = useState<boolean | null>(null);

  // Probe whether the file exists on the server (avoids broken-img flash)
  useEffect(() => {
    let cancelled = false;
    fetch(src, { method: "HEAD" })
      .then((r) => {
        if (!cancelled) setExists(r.ok && r.status !== 404);
      })
      .catch(() => {
        if (!cancelled) setExists(false);
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  const theme = GRADIENTS[index % GRADIENTS.length];

  return (
    <div
      className={`img-grain relative overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--cream-soft)] ${aspectClass} ${className}`}
    >
      {/* Gradient placeholder */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: `radial-gradient(120% 100% at 30% 20%, ${theme.from} 0%, ${theme.to} 70%)`,
          opacity: status === "loaded" ? 0 : 1,
          transition: "opacity 0.6s ease",
        }}
      >
        <div className="text-center">
          <div
            className="text-[10px] uppercase tracking-label-wide"
            style={{ color: theme.ink, opacity: 0.7 }}
          >
            {caption ?? "MA — Studio"}
          </div>
          <div
            className="mt-1 text-[13px] font-medium"
            style={{ color: theme.ink, opacity: 0.95 }}
          >
            {alt}
          </div>
        </div>
      </motion.div>

      {/* Real image — only render once we know it exists */}
      {exists && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]"
        />
      )}

      {/* Subtle grain layer always on top for premium texture */}
      <div className="img-grain pointer-events-none absolute inset-0 opacity-40" />
    </div>
  );
}
