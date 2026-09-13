"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { profile } from "@/lib/projects";

type Props = {
  onEnterWork: () => void;
};

/**
 * Full-bleed homepage hero inspired by tamasolajos.com.
 * A background image is rendered to a canvas with a heavy pixelation
 * (mosaic) effect that "breathes" (pixel size varies slowly), plus random
 * glitch scanlines for a live-feed / surveillance feel. The name sits
 * centered in white, with the title below. A "Work" link at the bottom
 * enters the first project page.
 */
export function VideoHero({ onEnterWork }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Load the background image once
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/projects/celebrating-25-years-1.png";
    img.onload = () => {
      imgRef.current = img;
    };
  }, []);

  // Canvas pixelation render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    const off = document.createElement("canvas");
    const octx = off.getContext("2d");

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      t += 0.016;
      const w = canvas.width;
      const h = canvas.height;
      const img = imgRef.current;

      if (img && img.naturalWidth > 0 && octx) {
        // Breathing pixel size — 7px to 11px, slow sine
        const pxSize = Math.max(4, 9 + Math.sin(t * 0.4) * 2);
        const sw = Math.max(1, Math.floor(w / pxSize));
        const sh = Math.max(1, Math.floor(h / pxSize));
        off.width = sw;
        off.height = sh;

        // Draw image "cover" into the small offscreen canvas
        const scale = Math.max(sw / img.naturalWidth, sh / img.naturalHeight);
        const dw = img.naturalWidth * scale;
        const dh = img.naturalHeight * scale;
        const dx = (sw - dw) / 2;
        const dy = (sh - dh) / 2;
        octx.drawImage(img, dx, dy, dw, dh);

        // Scale up with no smoothing → blocky pixels
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(off, 0, 0, w, h);

        // Cool desaturated color grade overlay
        ctx.fillStyle = "rgba(8, 10, 14, 0.58)";
        ctx.fillRect(0, 0, w, h);

        // Random glitch scanlines
        if (Math.random() > 0.8) {
          const y = Math.random() * h;
          const lh = 1 + Math.random() * 5;
          ctx.fillStyle = `rgba(255, 255, 255, ${0.04 + Math.random() * 0.06})`;
          ctx.fillRect(0, y, w, lh);
        }
        // Occasional darker glitch band
        if (Math.random() > 0.92) {
          const y = Math.random() * h;
          ctx.fillStyle = `rgba(0, 0, 0, ${0.1 + Math.random() * 0.15})`;
          ctx.fillRect(0, y, w, 3 + Math.random() * 8);
        }
      } else {
        // Fill dark while image loads
        ctx.fillStyle = "#08090c";
        ctx.fillRect(0, 0, w, h);
      }
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleClick = useCallback(() => onEnterWork(), [onEnterWork]);

  const nameChars = profile.name.split("");

  return (
    <div
      className="relative h-screen w-full cursor-pointer overflow-hidden bg-[#08090c]"
      onClick={handleClick}
    >
      {/* Pixelated background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        {/* Name — per-character fade-up */}
        <h1 className="font-mono-display flex justify-center text-balance text-[clamp(2rem,7vw,5rem)] leading-[1.05] text-white">
          {nameChars.map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3 + i * 0.045,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </h1>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + nameChars.length * 0.045 + 0.15, duration: 0.7 }}
          className="font-mono-label mt-6 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[11px] uppercase tracking-[0.44em] text-white/45"
        >
          {profile.roles.map((r, i) => (
            <span key={r} className="flex items-center gap-2.5">
              {r}
              {i < profile.roles.length - 1 && (
                <span className="text-white/20">·</span>
              )}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Work link — bottom center */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        onClick={(e) => {
          e.stopPropagation();
          onEnterWork();
        }}
        data-cursor="link"
        className="font-mono-label absolute bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-2 border-b border-white/25 pb-1 text-[12px] uppercase tracking-[0.24em] text-white/65 transition-colors hover:text-white hover:border-white/60"
      >
        Work
        <span className="text-white/40">→</span>
      </motion.button>

      {/* Studio mark — top center */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="font-mono-label absolute top-8 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.44em] text-white/35"
      >
        {profile.studio}
      </motion.div>
    </div>
  );
}
