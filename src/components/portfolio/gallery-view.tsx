"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import { galleryItems, type GalleryItem } from "@/lib/gallery";

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
      <div className="mx-auto max-w-[1280px] px-6 pt-12 pb-24 md:px-12 md:pt-16">
        {/* Minimalist Top Meta Bar */}
        <div className="mb-10 flex items-center justify-between border-b border-[var(--rule)] pb-6">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-[var(--meta)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            <span>/gallery</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-[var(--meta)]"
          >
            <span>Dubai · 2026</span>
            <span className="text-foreground/40">/</span>
            <span className="text-foreground">[{String(galleryItems.length).padStart(2, "0")}]</span>
          </motion.div>
        </div>

        {/* Gallery Grid with Dynamic Fluid Transitions */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
          {galleryItems.map((item, index) => {
            // Editorial rhythm: 5 columns / 7 columns alternating, 5th image wide architectural span
            let colSpan = "lg:col-span-6";
            if (index === 0) colSpan = "lg:col-span-5";
            else if (index === 1) colSpan = "lg:col-span-7";
            else if (index === 2) colSpan = "lg:col-span-5";
            else if (index === 3) colSpan = "lg:col-span-7";
            else if (index === 4) colSpan = "lg:col-span-12";

            return (
              <GalleryCard
                key={item.id}
                item={item}
                index={index}
                colSpan={colSpan}
                onOpen={() => handleSelect(index)}
              />
            );
          })}
        </div>
      </div>

      {/* Fullscreen Interactive Lightbox with Dynamic Directional Motion */}
      <AnimatePresence>
        {activeItem && selectedItemIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            onClick={handleClose}
            className="fixed inset-0 z-[90] flex flex-col justify-between bg-black/94 p-4 backdrop-blur-xl sm:p-6 md:p-8"
          >
            {/* Top Bar — Minimal Counter & Close */}
            <div
              className="flex items-center justify-between text-white/70"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.26em]">
                <span className="rounded border border-white/15 bg-white/10 px-2.5 py-1 text-white">
                  {String(selectedItemIndex + 1).padStart(2, "0")} / {String(galleryItems.length).padStart(2, "0")}
                </span>
                <span className="hidden sm:inline text-white/40">
                  {galleryItems[selectedItemIndex].aspect.toUpperCase()}
                </span>
              </div>

              <button
                onClick={handleClose}
                data-cursor="link"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/70 transition-all duration-300 hover:scale-105 hover:border-white/50 hover:bg-white hover:text-black"
                aria-label="Close"
              >
                <X className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
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
                className="group absolute left-2 sm:left-6 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/80 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-white hover:bg-white hover:text-black"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                data-cursor="link"
                className="group absolute right-2 sm:right-6 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/80 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-white hover:bg-white hover:text-black"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>

              {/* Dynamic Image with Framer Motion slide variants */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeItem.id}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({
                      x: d > 0 ? 80 : d < 0 ? -80 : 0,
                      opacity: 0,
                      scale: 0.95,
                    }),
                    center: {
                      x: 0,
                      opacity: 1,
                      scale: 1,
                      transition: {
                        x: { type: "spring", stiffness: 320, damping: 32 },
                        opacity: { duration: 0.25 },
                        scale: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                      },
                    },
                    exit: (d: number) => ({
                      x: d < 0 ? 80 : -80,
                      opacity: 0,
                      scale: 0.95,
                      transition: {
                        duration: 0.2,
                        ease: "easeIn",
                      },
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex max-h-[76vh] max-w-[90vw] items-center justify-center"
                >
                  <img
                    src={activeItem.src}
                    alt=""
                    className="max-h-[76vh] max-w-[90vw] rounded-md object-contain shadow-2xl transition-transform duration-500 select-none"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Minimal Filmstrip Dock & Controls */}
            <div
              className="flex flex-col items-center gap-3 pt-2"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Thumbnail Strip */}
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1.5 backdrop-blur-md">
                {galleryItems.map((thumb, idx) => {
                  const isSelected = idx === selectedItemIndex;
                  return (
                    <button
                      key={thumb.id}
                      onClick={() => handleSelect(idx)}
                      data-cursor="link"
                      className={`group relative h-9 w-12 overflow-hidden rounded transition-all duration-300 sm:h-10 sm:w-14 ${
                        isSelected
                          ? "ring-2 ring-white scale-105 opacity-100"
                          : "opacity-40 hover:opacity-85 hover:scale-100"
                      }`}
                      aria-label={`Jump to image ${idx + 1}`}
                    >
                      <img
                        src={thumb.src}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute bottom-0.5 right-1 text-[8px] font-medium tracking-tight text-white drop-shadow">
                        0{idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Esc / Arrow hint */}
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-white/40">
                <span>&larr; &rarr; Navigate</span>
                <span>·</span>
                <span>Esc Close</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Individual Gallery Card with dynamic interactive hover kinetics:
 * - 3D subtle tilt on mouse tracking
 * - Smooth spring scale
 * - Sleek corner viewfinder marks that appear on hover
 * - Shimmer light sweep
 */
function GalleryCard({
  item,
  index,
  colSpan,
  onOpen,
}: {
  item: GalleryItem;
  index: number;
  colSpan: string;
  onOpen: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt: max 4 degrees
    const rX = ((y - centerY) / centerY) * -4.5;
    const rY = ((x - centerX) / centerX) * 4.5;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.7,
        delay: index * 0.09,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`relative ${colSpan}`}
      style={{ perspective: 1000 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onOpen}
        data-cursor="link"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
          transition: isHovered
            ? "transform 0.12s ease-out, border-color 0.4s ease, box-shadow 0.4s ease"
            : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, box-shadow 0.4s ease",
        }}
        className={`group relative block w-full cursor-pointer overflow-hidden rounded-lg border bg-[var(--cream-soft)] ${
          isHovered
            ? "border-foreground/40 shadow-xl shadow-foreground/5"
            : "border-[var(--rule)] shadow-sm"
        }`}
      >
        {/* Dynamic Aspect Ratio Container */}
        <div
          className={`relative w-full overflow-hidden ${
            item.aspect === "portrait"
              ? "aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4]"
              : index === 4
              ? "aspect-[16/9] lg:aspect-[21/9]"
              : "aspect-[16/10]"
          }`}
        >
          {/* Main Image with dynamic spring scale */}
          <motion.img
            src={item.src}
            alt=""
            loading="lazy"
            animate={{
              scale: isHovered ? 1.055 : 1,
            }}
            transition={{
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="h-full w-full object-cover transition-opacity duration-300"
          />

          {/* Dynamic Light Sweep Shimmer effect */}
          <div
            className={`pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 ease-out ${
              isHovered ? "translate-x-full" : ""
            }`}
          />

          {/* Minimalist Viewfinder Corner Marks (appear on hover) */}
          <div
            className={`pointer-events-none absolute inset-3 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Top-Left */}
            <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-white/80 drop-shadow" />
            {/* Top-Right */}
            <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-white/80 drop-shadow" />
            {/* Bottom-Left */}
            <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-white/80 drop-shadow" />
            {/* Bottom-Right */}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-white/80 drop-shadow" />
          </div>

          {/* Minimal Index Watermark (bottom right) */}
          <div
            className={`pointer-events-none absolute bottom-3.5 right-3.5 flex items-center gap-1.5 rounded-full border border-black/20 bg-black/50 px-2.5 py-1 text-[10px] tracking-[0.2em] text-white/90 backdrop-blur-md transition-all duration-300 ${
              isHovered ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
            }`}
          >
            <Maximize2 className="h-2.5 w-2.5" />
            <span>0{index + 1}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
