"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";

// YouTube video IDs from the playlist
const videoIds = [
  "DRI4MzCqufE", "o5NJAPjYo4I", "osZ0aLcv3r0", "YZgHwNR4lLI",
  "-NEOfV_heWM", "0XwV6MLyVyM", "28FvZ3L6jdc", "2ouUN-oK2qM",
  "3j6hffmF8T8", "3rXltYmkKtg", "4kTP0OcaSr0", "7fjJYkQQAoc",
  "7g3PBYW3s2c", "8dChvdMwhKo", "9xz-yNCCkkk", "BJH2MgJl3vw",
  "D0w9k8Z5KxA", "EFOEdfHQEQ0", "F0rloffmLoU", "Fu4B7_Kh7-c",
  "Gx24RnG5Lp4", "H1dtSWZGE3M", "HesIU0DGGR8", "I-SDq21-Gkc",
  "KQ3tdrhL7i4", "LkzRD0lh89c", "M3zUI9dg2dA", "MgTneedyvYg",
  "NucNl7_EezQ", "OSJKxkP12O0", "Q4RTWl63YAM", "QNkECrLLUfU",
  "SkPwCSgqjD8", "T11gZnM-FvI", "UYJuaDa6LqA", "VR4qg7vMdRk",
  "Vu5sVGKaJRc", "Y0i7Wg1XF8w", "YnsQH-Ljn-Q", "_Umka8DKls4",
  "_ltXXHjox4w", "aKHuQXnsCeg", "b9AVrj8UFvs", "eN_ru_u57S0",
  "f_Dq2Qis6Xc", "h3pq6hOKnkc", "kbPMzS01zMw", "mmzvtpxrZ9g",
  "muY5KZXIEx4", "pvv60wlvIC8", "qBTZgWF_ffk", "qQPKlfP3ExI",
  "u3jUxbPX5zw", "uh8Y_0ID_B0", "vf4NrmL8lLA", "vocujOHLCwQ",
  "w2QFy2ZcKSw", "waVVu9h4sbE", "xZa-hA_xwR4", "yBhISe1D9GA",
  "ylGgxnt6GCY", "zO_t_8iif5o",
];

/**
 * YouTube playlist slider — shows above the quotes panel.
 * Horizontal scrollable strip of video thumbnails. Click to play inline.
 */
export function VideoSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState<string | null>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="border-b border-[var(--rule)] bg-[var(--cream)]">
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-6 pb-3 md:px-12">
        <span className="font-mono-label text-[10px] uppercase tracking-[0.24em] text-[var(--meta)]">
          After Effects Work · {videoIds.length} videos
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            data-cursor="link"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--rule)] text-foreground/60 transition-colors hover:bg-foreground hover:text-[var(--cream)]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            data-cursor="link"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--rule)] text-foreground/60 transition-colors hover:bg-foreground hover:text-[var(--cream)]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Scrollable thumbnails */}
      <div
        ref={scrollRef}
        className="scroll-cream flex gap-3 overflow-x-auto px-8 pb-5 md:px-12"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {videoIds.map((id, i) => (
          <button
            key={id}
            onClick={() => setPlaying(id)}
            data-cursor="view"
            className="group relative shrink-0 overflow-hidden rounded-lg border border-[var(--rule)] bg-black"
            style={{ width: 200, height: 113 }}
          >
            <img
              src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`}
              alt={`Video ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/40">
              <Play className="h-8 w-8 fill-white text-white opacity-80 transition-opacity group-hover:opacity-100" />
            </div>
            <span className="font-mono-label absolute bottom-1.5 left-2 text-[9px] tabular-nums text-white/70">
              {String(i + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>

      {/* Video player modal */}
      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setPlaying(null)}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/85 backdrop-blur-md"
          >
            <button
              onClick={() => setPlaying(null)}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 text-[var(--cream)] transition-colors hover:bg-foreground/10"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[900px] px-6"
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-foreground/20 bg-black shadow-2xl">
                <iframe
                  src={`https://www.youtube.com/embed/${playing}?autoplay=1&rel=0`}
                  title="YouTube video player"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
