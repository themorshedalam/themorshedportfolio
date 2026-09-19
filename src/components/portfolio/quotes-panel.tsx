"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { quranVerses } from "@/lib/quran-verses";
import { PrayerTimes } from "./prayer-times";

type Props = {
  active: boolean;
};

/**
 * Right panel — showreel video centered (desktop), 
 * Quran verse at bottom on mobile.
 * Smart video loading: direct URL on desktop, blob on iOS/Safari.
 */
export function QuotesPanel({ active }: Props) {
  const [index, setIndex] = useState(0);
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [videoLoading, setVideoLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!active) return;
    timer.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % quranVerses.length);
    }, 10000);
    return () => clearInterval(timer.current);
  }, [active]);

  // Smart video loading — direct URL on desktop, blob on iOS
  useEffect(() => {
    const src = "/projects/showreel.mp4";
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isIOS || isSafari) {
      let url: string;
      fetch(src)
        .then((res) => res.blob())
        .then((blob) => {
          url = URL.createObjectURL(blob);
          setVideoSrc(url);
          setVideoLoading(false);
        })
        .catch(() => {
          setVideoSrc(src);
          setVideoLoading(false);
        });
      return () => {
        if (url) URL.revokeObjectURL(url);
      };
    } else {
      // Desktop: use direct URL instantly — no loading delay
      setVideoSrc(src);
      setVideoLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!videoLoading && videoSrc && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [videoLoading, videoSrc]);

  const verse = quranVerses[index];

  return (
    <div className="flex h-full flex-col items-center justify-center bg-[var(--cream)]">
      {/* {t.showreel} — centered */}
      <div className="w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono-label mb-2 text-[10px] uppercase tracking-[0.24em] text-[var(--meta)]">
          Showreel
        </div>
        {/* Mobile: GIF banner above showreel */}
        <img
          src="/projects/showreel-banner.gif"
          alt="Showreel banner"
          loading="lazy"
          decoding="async"
          className="mb-4 block w-full max-w-[280px] h-auto rounded-2xl mx-auto md:hidden"
        />
        {/* {t.showreel} video — poster shows instantly, video plays when ready */}
        {videoLoading ? (
          <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-[var(--rule)] bg-[var(--cream-soft)] overflow-hidden">
            <img
              src="/projects/showreel-poster.jpg"
              alt="Showreel loading"
              className="absolute h-full w-full object-cover opacity-50"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="relative h-8 w-8 rounded-full border-2 border-white/40 border-t-white"
            />
          </div>
        ) : (
          <video
            ref={videoRef}
            src={videoSrc || undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/projects/showreel-poster.jpg"
            onContextMenu={(e) => e.preventDefault()}
            className="block w-full h-auto rounded-2xl border border-[var(--rule)]"
          />
        )}
      </div>

      {/* Quran verse — mobile only, at bottom */}
      <div className="mt-6 px-8 pb-2 md:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <p className="font-mono-label text-[13px] leading-[1.4] text-foreground/70">
              {verse.english}
            </p>
            <p className="font-mono-label mt-1 text-[9px] uppercase tracking-[0.12em] text-[var(--meta)]">
              {verse.reference}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prayer times — mobile only */}
      <div className="md:hidden">
        <PrayerTimes />
      </div>
    </div>
  );
}
