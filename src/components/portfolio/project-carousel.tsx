"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, Layers } from "lucide-react";
import type { ProjectCarousel } from "@/lib/projects";

type Props = {
  carousels: ProjectCarousel[];
  onOpenLightbox: (src: string) => void;
};

export function ProjectCarouselSection({ carousels, onOpenLightbox }: Props) {
  const [activeCarouselIdx, setActiveCarouselIdx] = useState(0);
  const [slideIndices, setSlideIndices] = useState<Record<number, number>>({
    0: 0,
    1: 0,
  });

  const activeCarousel = carousels[activeCarouselIdx] || carousels[0];
  const activeSlideIdx = slideIndices[activeCarouselIdx] ?? 0;
  const currentSlide = activeCarousel.slides[activeSlideIdx] || activeCarousel.slides[0];

  const setSlide = (newIndex: number) => {
    const total = activeCarousel.slides.length;
    const bounded = (newIndex + total) % total;
    setSlideIndices((prev) => ({
      ...prev,
      [activeCarouselIdx]: bounded,
    }));
  };

  const nextSlide = () => setSlide(activeSlideIdx + 1);
  const prevSlide = () => setSlide(activeSlideIdx - 1);

  return (
    <div className="mb-20">
      {/* Section Header */}
      <div className="font-mono-label mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--rule)] pb-4">
        <div className="flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 text-foreground/60" />
          <span className="text-[11px] uppercase tracking-[0.24em] text-[var(--meta)]">
            Social Carousel Series
          </span>
        </div>

        {/* Carousel Tabs (KSA / Qatar) */}
        {carousels.length > 1 && (
          <div className="flex items-center gap-1 rounded-sm border border-[var(--rule)] bg-foreground/[0.03] p-1">
            {carousels.map((c, idx) => {
              const isActive = idx === activeCarouselIdx;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCarouselIdx(idx)}
                  className={`px-3 py-1 text-[11px] font-mono tracking-wider uppercase transition-colors ${
                    isActive
                      ? "bg-foreground text-[var(--cream)] shadow-sm"
                      : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  {c.title}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Carousel Viewer */}
      <div className="mx-auto max-w-[560px]">
        {/* Active Slide Display Container */}
        <div className="group relative overflow-hidden rounded-sm border border-[var(--rule)] bg-black/5 shadow-sm">
          {/* 4:5 Aspect Ratio Container */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900">
            <AnimatePresence mode="wait">
              <motion.img
                key={`${activeCarousel.id}-${activeSlideIdx}`}
                src={currentSlide.src}
                alt={currentSlide.caption}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="h-full w-full object-cover cursor-pointer"
                onClick={() => onOpenLightbox(currentSlide.src)}
              />
            </AnimatePresence>

            {/* Lightbox Trigger Icon Button */}
            <button
              onClick={() => onOpenLightbox(currentSlide.src)}
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-black/80"
              title="View full size"
              aria-label="View full size"
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            {/* Slide Index Badge */}
            <div className="font-mono-label absolute bottom-3 left-3 z-10 rounded-sm bg-black/70 px-2.5 py-1 text-[10px] tracking-widest text-white/90 backdrop-blur-sm">
              SLIDE {String(activeSlideIdx + 1).padStart(2, "0")} / {String(activeCarousel.slides.length).padStart(2, "0")}
            </div>

            {/* Nav Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white opacity-80 backdrop-blur-sm transition-all hover:bg-black/80 hover:opacity-100 sm:left-3"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white opacity-80 backdrop-blur-sm transition-all hover:bg-black/80 hover:opacity-100 sm:right-3"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Caption & Navigation Controls */}
        <div className="font-mono-label mt-4 flex items-center justify-between text-[11px] text-[var(--meta)]">
          <span className="truncate pr-4 uppercase tracking-[0.2em]">
            {currentSlide.caption}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            {activeCarousel.slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`Jump to slide ${i + 1}`}
                className={`h-1.5 transition-all ${
                  i === activeSlideIdx
                    ? "w-6 bg-foreground"
                    : "w-2 bg-foreground/20 hover:bg-foreground/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 4-Panel Filmstrip Row (All 4 frames visible side-by-side) */}
        <div className="mt-5 grid grid-cols-4 gap-2">
          {activeCarousel.slides.map((slide, i) => {
            const isSelected = i === activeSlideIdx;
            return (
              <button
                key={slide.src}
                onClick={() => setSlide(i)}
                className={`group/thumb relative aspect-[4/5] overflow-hidden rounded-sm border transition-all text-left ${
                  isSelected
                    ? "border-foreground ring-2 ring-foreground/20"
                    : "border-[var(--rule)] opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={slide.src}
                  alt={slide.caption}
                  className="h-full w-full object-cover"
                />
                <span className="font-mono absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[9px] text-white">
                  0{i + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Divider Before Other GIFs */}
      <div className="font-mono-label mt-16 mb-10 flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-[var(--meta)]">
        <span className="h-px flex-1 bg-[var(--rule)]" />
        <span>Kinetic Animations &amp; Motion Frames</span>
        <span className="h-px flex-1 bg-[var(--rule)]" />
      </div>
    </div>
  );
}
