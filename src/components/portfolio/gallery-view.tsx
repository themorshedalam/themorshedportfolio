"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { galleryItems } from "@/lib/gallery";

export function GalleryView() {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const handlePrev = useCallback(() => {
    if (selectedItemIndex === null) return;
    setSelectedItemIndex((prev) =>
      prev === null ? null : (prev - 1 + galleryItems.length) % galleryItems.length
    );
  }, [selectedItemIndex]);

  const handleNext = useCallback(() => {
    if (selectedItemIndex === null) return;
    setSelectedItemIndex((prev) =>
      prev === null ? null : (prev + 1) % galleryItems.length
    );
  }, [selectedItemIndex]);

  const handleClose = useCallback(() => {
    setSelectedItemIndex(null);
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (selectedItemIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedItemIndex, handleClose, handlePrev, handleNext]);

  const activeItem = selectedItemIndex !== null ? galleryItems[selectedItemIndex] : null;

  return (
    <div className="scroll-cream relative h-full overflow-y-auto bg-[var(--cream)]">
      <div className="mx-auto max-w-[1240px] px-6 pt-12 pb-24 md:px-12 md:pt-16">
        {/* Minimalist Header */}
        <div className="mb-10 flex items-center justify-between border-b border-[var(--rule)] pb-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono-label flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-[var(--meta)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            <span>/gallery</span>
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="font-mono-label text-[11px] uppercase tracking-[0.24em] text-[var(--meta)]"
          >
            [{String(galleryItems.length).padStart(2, "0")}]
          </motion.span>
        </div>

        {/* Minimalist Gallery Grid — Pure Images & Fluid Transitions */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
          {galleryItems.map((item, index) => {
            // Editorial rhythm: 5 columns / 7 columns alternating, last image wide banner
            let colSpan = "lg:col-span-6";
            if (index === 0) colSpan = "lg:col-span-5";
            else if (index === 1) colSpan = "lg:col-span-7";
            else if (index === 2) colSpan = "lg:col-span-5";
            else if (index === 3) colSpan = "lg:col-span-7";
            else if (index === 4) colSpan = "lg:col-span-12";

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group relative overflow-hidden rounded-lg border border-[var(--rule)] bg-[var(--cream-soft)] ${colSpan}`}
              >
                <div
                  onClick={() => setSelectedItemIndex(index)}
                  data-cursor="link"
                  className={`relative block h-full w-full cursor-pointer overflow-hidden ${
                    item.aspect === "portrait"
                      ? "aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4]"
                      : index === 4
                      ? "aspect-[16/9] lg:aspect-[21/9]"
                      : "aspect-[16/10]"
                  }`}
                >
                  <img
                    src={item.src}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025] group-hover:brightness-[1.03]"
                  />
                  {/* Subtle hover sheen */}
                  <div className="pointer-events-none absolute inset-0 bg-foreground/0 transition-colors duration-500 group-hover:bg-foreground/[0.02]" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Minimalist Fullscreen Lightbox */}
      <AnimatePresence>
        {activeItem && selectedItemIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 z-[90] flex flex-col justify-between bg-black/92 p-4 backdrop-blur-md sm:p-6 md:p-8"
          >
            {/* Top Bar — Minimal Counter & Close */}
            <div
              className="flex items-center justify-between text-white/70"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-mono-label text-[11px] uppercase tracking-[0.24em]">
                {String(selectedItemIndex + 1).padStart(2, "0")} / {String(galleryItems.length).padStart(2, "0")}
              </span>

              <button
                onClick={handleClose}
                data-cursor="link"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Center Image with Next / Previous Arrows */}
            <div
              className="relative flex min-h-0 flex-1 items-center justify-center py-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                data-cursor="link"
                className="absolute left-2 sm:left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/80 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white hover:text-black"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                data-cursor="link"
                className="absolute right-2 sm:right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/80 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white hover:text-black"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <AnimatePresence mode="wait">
                <motion.img
                  key={activeItem.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  src={activeItem.src}
                  alt=""
                  className="max-h-[82vh] max-w-[90vw] rounded-md object-contain shadow-2xl"
                />
              </AnimatePresence>
            </div>

            {/* Bottom Minimal Hint */}
            <div
              className="text-center font-mono-label text-[10px] uppercase tracking-[0.24em] text-white/40"
              onClick={(e) => e.stopPropagation()}
            >
              Esc to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
