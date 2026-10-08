"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { galleryItems } from "@/lib/gallery";

export function GalleryView() {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<number>(0);

  const handlePrev = useCallback(() => {
    if (selectedItemIndex === null) return;
    setDirection(-1);
    setSelectedItemIndex((prev) =>
      prev === null ? null : (prev - 1 + galleryItems.length) % galleryItems.length
    );
  }, [selectedItemIndex]);

  const handleNext = useCallback(() => {
    if (selectedItemIndex === null) return;
    setDirection(1);
    setSelectedItemIndex((prev) =>
      prev === null ? null : (prev + 1) % galleryItems.length
    );
  }, [selectedItemIndex]);

  const handleSelect = useCallback(
    (index: number) => {
      if (selectedItemIndex === null) {
        setDirection(0);
      } else {
        setDirection(index > selectedItemIndex ? 1 : -1);
      }
      setSelectedItemIndex(index);
    },
    [selectedItemIndex]
  );

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
        {/* Minimalist Top Bar */}
        <div className="mb-10 flex items-center justify-between border-b border-[var(--rule)] pb-6">
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-[var(--meta)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            <span>/gallery</span>
          </motion.div>

          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-[11px] uppercase tracking-[0.24em] text-[var(--meta)]"
          >
            [{String(galleryItems.length).padStart(2, "0")}]
          </motion.span>
        </div>

        {/* Clean, Gapless Aligned Masonry Layout */}
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [column-fill:_balance]">
          {galleryItems.map((item, index) => (
            <GalleryGridCard
              key={item.id}
              item={item}
              index={index}
              onSelect={() => handleSelect(index)}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen Interactive Lightbox with Dynamic Directional Motion */}
      <AnimatePresence>
        {activeItem && selectedItemIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={handleClose}
            className="fixed inset-0 z-[90] flex flex-col justify-between bg-black/92 p-4 backdrop-blur-xl sm:p-6 md:p-8"
          >
            {/* Top Bar — Counter & Close */}
            <div
              className="flex items-center justify-between text-white/70"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[11px] uppercase tracking-[0.26em]">
                {String(selectedItemIndex + 1).padStart(2, "0")} /{" "}
                {String(galleryItems.length).padStart(2, "0")}
              </span>

              <button
                onClick={handleClose}
                data-cursor="link"
                className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/70 transition-colors hover:bg-white hover:text-black"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Center Area — Directional Slide Animation */}
            <div
              className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden py-3"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Previous Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                data-cursor="link"
                className="group absolute left-2 sm:left-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/80 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white hover:text-black"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                data-cursor="link"
                className="group absolute right-2 sm:right-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/80 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white hover:text-black"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Dynamic Image with slide variants */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeItem.id}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({
                      x: d > 0 ? 60 : d < 0 ? -60 : 0,
                      opacity: 0,
                      scale: 0.98,
                    }),
                    center: {
                      x: 0,
                      opacity: 1,
                      scale: 1,
                      transition: {
                        x: { type: "spring", stiffness: 340, damping: 34 },
                        opacity: { duration: 0.2 },
                        scale: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                      },
                    },
                    exit: (d: number) => ({
                      x: d < 0 ? 60 : -60,
                      opacity: 0,
                      scale: 0.98,
                      transition: {
                        duration: 0.18,
                        ease: "easeIn",
                      },
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex max-h-[78vh] max-w-[90vw] items-center justify-center"
                >
                  <LightboxImage item={activeItem} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Minimal Filmstrip Dock */}
            <div
              className="flex flex-col items-center gap-2.5 pt-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1.5 backdrop-blur-md">
                {galleryItems.map((thumb, idx) => {
                  const isSelected = idx === selectedItemIndex;
                  return (
                    <button
                      key={thumb.id}
                      onClick={() => handleSelect(idx)}
                      data-cursor="link"
                      className={`relative h-9 w-12 overflow-hidden rounded transition-all duration-200 sm:h-10 sm:w-14 ${
                        isSelected
                          ? "ring-2 ring-white scale-105 opacity-100"
                          : "opacity-40 hover:opacity-80"
                      }`}
                      aria-label={`Jump to image ${idx + 1}`}
                    >
                      <img
                        src={thumb.src}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">
                Esc to close
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GalleryGridCard({
  item,
  index,
  onSelect,
}: {
  item: (typeof galleryItems)[number];
  index: number;
  onSelect: () => void;
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="mb-6 inline-block w-full break-inside-avoid"
    >
      <div
        onClick={onSelect}
        data-cursor="link"
        className="group relative block w-full cursor-pointer overflow-hidden rounded-lg border border-[var(--rule)] bg-[var(--cream-soft)] transition-colors duration-300 hover:border-foreground/30"
      >
        {hasError ? (
          <div className="flex flex-col items-center justify-center p-8 text-center aspect-[4/5] bg-[var(--cream-soft)] border border-dashed border-[var(--rule)]">
            <span className="font-mono-label text-[10px] uppercase tracking-[0.24em] text-[var(--meta)]">
              {item.category} · {item.date}
            </span>
            <h4 className="mt-3 text-sm font-medium text-foreground">{item.title}</h4>
            {item.description && (
              <p className="mt-2 text-xs text-[var(--meta)] max-w-[220px] leading-relaxed">
                {item.description}
              </p>
            )}
            <span className="mt-4 inline-block text-[10px] uppercase tracking-wider text-[var(--meta)] border border-[var(--rule)] px-3 py-1 rounded-full">
              Photo Upload Pending
            </span>
          </div>
        ) : (
          <img
            src={item.src}
            alt={item.title}
            loading="lazy"
            onError={() => setHasError(true)}
            className="block h-auto w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        )}
      </div>
    </motion.div>
  );
}

function LightboxImage({ item }: { item: (typeof galleryItems)[number] }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex max-h-[78vh] w-[90vw] max-w-lg flex-col items-center justify-center rounded-2xl border border-white/20 bg-neutral-900/90 p-8 text-center text-white backdrop-blur-md">
        <span className="font-mono-label text-[11px] uppercase tracking-[0.26em] text-white/60">
          {item.category} · {item.date}
        </span>
        <h3 className="mt-3 text-lg font-medium tracking-tight text-white">{item.title}</h3>
        {item.description && (
          <p className="mt-3 text-sm text-white/70 leading-relaxed max-w-sm">
            {item.description}
          </p>
        )}
        {item.location && (
          <span className="mt-4 text-xs text-white/50">{item.location}</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={item.src}
      alt={item.title}
      onError={() => setHasError(true)}
      className="max-h-[78vh] max-w-[90vw] rounded-md object-contain shadow-2xl select-none"
    />
  );
}
