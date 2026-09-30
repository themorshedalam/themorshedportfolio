"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, ChevronLeft, ChevronRight, X, Calendar, MapPin, Sparkles } from "lucide-react";
import { galleryItems, type GalleryItem } from "@/lib/gallery";

type FilterType = "All" | "Office Life" | "Events & Gatherings";

export function GalleryView() {
  const [filter, setFilter] = useState<FilterType>("All");
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const filteredItems = filter === "All"
    ? galleryItems
    : galleryItems.filter((item) => item.category === filter);

  const handlePrev = useCallback(() => {
    if (selectedItemIndex === null) return;
    setSelectedItemIndex((prev) =>
      prev === null ? null : (prev - 1 + filteredItems.length) % filteredItems.length
    );
  }, [selectedItemIndex, filteredItems.length]);

  const handleNext = useCallback(() => {
    if (selectedItemIndex === null) return;
    setSelectedItemIndex((prev) =>
      prev === null ? null : (prev + 1) % filteredItems.length
    );
  }, [selectedItemIndex, filteredItems.length]);

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

  const activeLightboxItem = selectedItemIndex !== null ? filteredItems[selectedItemIndex] : null;

  return (
    <div className="scroll-cream relative h-full overflow-y-auto bg-[var(--cream)]">
      <div className="mx-auto max-w-[1280px] px-6 pt-12 pb-24 md:px-12 md:pt-16">
        {/* Breadcrumb & Live Tag */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono-label flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-[var(--meta)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            <span>/gallery</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-mono-label flex items-center gap-2 rounded-full border border-[var(--rule)] bg-[var(--cream-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--meta)]"
          >
            <Sparkles className="h-3 w-3 text-foreground" />
            <span>Visual Archive · Dubai</span>
          </motion.div>
        </div>

        {/* Header Title Section */}
        <div className="mb-12 border-b border-[var(--rule)] pb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
          >
            <div className="max-w-2xl">
              <span className="font-mono-label text-[11px] uppercase tracking-[0.24em] text-[var(--meta)]">
                Behind the Scenes &amp; Celebrations
              </span>
              <h1 className="font-mono-display mt-2 text-balance text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-[1.1] text-foreground">
                Office &amp; Event Gallery
              </h1>
              <p className="mt-4 font-mono-label text-[13px] leading-relaxed text-foreground/75">
                A visual chronicle of daily studio life, team collaborations, product milestones, and industry gatherings at ENTERTAINER FZ LLC and across Dubai.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {(["All", "Office Life", "Events & Gatherings"] as FilterType[]).map((tab) => {
                const count = tab === "All"
                  ? galleryItems.length
                  : galleryItems.filter((i) => i.category === tab).length;
                const isActive = filter === tab;

                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setFilter(tab);
                      setSelectedItemIndex(null);
                    }}
                    data-cursor="link"
                    className={`font-mono-label flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition-all duration-300 ${
                      isActive
                        ? "border-foreground bg-foreground text-[var(--cream)] shadow-sm"
                        : "border-[var(--rule)] bg-[var(--cream-soft)] text-foreground/70 hover:border-foreground/50 hover:text-foreground"
                    }`}
                  >
                    <span>{tab}</span>
                    <span
                      className={`text-[9px] ${
                        isActive ? "text-[var(--cream)]/80" : "text-[var(--meta)]"
                      }`}
                    >
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12"
        >
          {filteredItems.map((item, index) => {
            // Adaptive editorial layout column spans
            // Index 0: 5 cols (portrait), Index 1: 7 cols (landscape), Index 2: 4 cols (portrait), Index 3: 8 cols (landscape), Index 4: 12 cols (landscape banner)
            let colSpan = "lg:col-span-6";
            if (filteredItems.length === 5) {
              if (index === 0) colSpan = "lg:col-span-5";
              else if (index === 1) colSpan = "lg:col-span-7";
              else if (index === 2) colSpan = "lg:col-span-5";
              else if (index === 3) colSpan = "lg:col-span-7";
              else if (index === 4) colSpan = "lg:col-span-12";
            } else {
              colSpan = item.aspect === "portrait" ? "lg:col-span-5" : "lg:col-span-7";
            }

            return (
              <motion.article
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                key={item.id}
                className={`group relative overflow-hidden rounded-xl border border-[var(--rule)] bg-[var(--cream-soft)] transition-shadow duration-300 hover:shadow-lg ${colSpan}`}
              >
                {/* Image Container */}
                <div
                  className={`relative w-full overflow-hidden bg-foreground/5 ${
                    item.aspect === "portrait"
                      ? "aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4]"
                      : index === 4 && filteredItems.length === 5
                      ? "aspect-[16/9] lg:aspect-[21/9]"
                      : "aspect-[16/10] sm:aspect-[16/10]"
                  }`}
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />

                  {/* Top-right expand button */}
                  <button
                    onClick={() => setSelectedItemIndex(index)}
                    data-cursor="link"
                    aria-label={`Expand ${item.title}`}
                    className="absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full border border-foreground/20 bg-background/80 text-foreground opacity-90 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-background hover:opacity-100 group-hover:opacity-100 md:opacity-0"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>

                  {/* Category Pill on top-left */}
                  <div className="absolute left-3.5 top-3.5">
                    <span className="font-mono-label rounded-md border border-foreground/15 bg-background/85 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-foreground backdrop-blur-md">
                      {item.category}
                    </span>
                  </div>

                  {/* Gradient click overlay */}
                  <div
                    onClick={() => setSelectedItemIndex(index)}
                    className="absolute inset-0 cursor-pointer bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </div>

                {/* Details Footer */}
                <div className="flex flex-col justify-between border-t border-[var(--rule)] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-mono-display text-[15px] font-medium tracking-[0.01em] text-foreground">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="mt-1 font-mono-label text-[12px] leading-relaxed text-foreground/70">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--rule)]/60 pt-3 text-[11px] text-[var(--meta)]">
                    {item.location && (
                      <span className="font-mono-label flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-foreground/50" />
                        <span>{item.location}</span>
                      </span>
                    )}
                    {item.date && (
                      <span className="font-mono-label flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-foreground/50" />
                        <span>{item.date}</span>
                      </span>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>

      {/* Full-Screen Interactive Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxItem && selectedItemIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 z-[90] flex flex-col justify-between bg-black/90 p-4 backdrop-blur-md sm:p-6 md:p-8"
          >
            {/* Top Lightbox Bar */}
            <div
              className="flex items-center justify-between text-white/80"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-mono-label flex items-center gap-3 text-[11px] uppercase tracking-[0.2em]">
                <span className="rounded bg-white/10 px-2 py-1 text-white">
                  {selectedItemIndex + 1} / {filteredItems.length}
                </span>
                <span className="hidden sm:inline text-white/60">
                  {activeLightboxItem.category}
                </span>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                data-cursor="link"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Close lightbox"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Center Image Container + Navigation Arrows */}
            <div
              className="relative flex min-h-0 flex-1 items-center justify-center py-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                data-cursor="link"
                className="absolute left-2 sm:left-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white hover:text-black"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                data-cursor="link"
                className="absolute right-2 sm:right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white hover:text-black"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Main Image */}
              <motion.img
                key={activeLightboxItem.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                src={activeLightboxItem.src}
                alt={activeLightboxItem.title}
                className="max-h-[75vh] max-w-[88vw] rounded-lg object-contain shadow-2xl"
              />
            </div>

            {/* Bottom Caption Bar */}
            <div
              className="mx-auto max-w-2xl text-center text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-mono-display text-base font-medium tracking-[0.02em] sm:text-lg">
                {activeLightboxItem.title}
              </h2>
              {activeLightboxItem.description && (
                <p className="mt-1 font-mono-label text-xs sm:text-sm text-white/70">
                  {activeLightboxItem.description}
                </p>
              )}
              <div className="mt-2 flex items-center justify-center gap-4 font-mono-label text-[10px] uppercase tracking-[0.2em] text-white/50">
                {activeLightboxItem.location && <span>{activeLightboxItem.location}</span>}
                {activeLightboxItem.date && <span>· {activeLightboxItem.date}</span>}
                <span className="hidden sm:inline">· Press &larr; / &rarr; or Esc</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
