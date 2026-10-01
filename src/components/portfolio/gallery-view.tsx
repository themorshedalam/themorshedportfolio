"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Upload, Loader2, Sparkles } from "lucide-react";
import { galleryItems } from "@/lib/gallery";

export function GalleryView() {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [cacheBust, setCacheBust] = useState<number>(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Upload handler for photos (supports HEIC, JPG, PNG with auto color-correction)
  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadSuccess(null);
    try {
      const res = await fetch("/api/upload-gallery", {
        method: "POST",
        body: file,
      });
      const data = await res.json();
      if (data.success) {
        setCacheBust(Date.now());
        setImageErrors((prev) => ({ ...prev, "gallery-art-dubai": false }));
        setUploadSuccess("Photo processed with editorial color correction & pushed to GitHub!");
        setTimeout(() => setUploadSuccess(null), 6000);
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(err.message || "Failed to process photo");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
    }
  };

  const activeItem = selectedItemIndex !== null ? galleryItems[selectedItemIndex] : null;

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className="scroll-cream relative h-full overflow-y-auto bg-[var(--cream)]"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.heic,.HEIC"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />

      <div className="mx-auto max-w-[1240px] px-6 pt-12 pb-24 md:px-12 md:pt-16">
        {/* Minimalist Top Bar */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--rule)] pb-6">
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-[var(--meta)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            <span>/gallery</span>
          </motion.div>

          <div className="flex items-center gap-4">
            {uploadSuccess && (
              <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                <Sparkles className="h-3 w-3" />
                {uploadSuccess}
              </span>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              data-cursor="link"
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--rule)] bg-[var(--cream-soft)] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/80 transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin text-foreground" />
                  <span>Color Correcting...</span>
                </>
              ) : (
                <>
                  <Upload className="h-3 w-3 text-[var(--meta)] transition-transform group-hover:-translate-y-0.5" />
                  <span>Upload / Drop IMG_1277</span>
                </>
              )}
            </button>

            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-[11px] uppercase tracking-[0.24em] text-[var(--meta)]"
            >
              [{String(galleryItems.length).padStart(2, "0")}]
            </motion.span>
          </div>
        </div>

        {/* Clean, Gapless Aligned Masonry Layout */}
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [column-fill:_balance]">
          {galleryItems.map((item, index) => {
            const hasError = imageErrors[item.id];
            const imgSrc = `${item.src}?v=${cacheBust}`;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mb-6 inline-block w-full break-inside-avoid"
              >
                {hasError ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    data-cursor="link"
                    className="group relative flex aspect-[3/4] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[var(--rule)] bg-[var(--cream-soft)] p-6 text-center transition-all duration-300 hover:border-foreground/50 hover:bg-[var(--cream)]"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--rule)] bg-background">
                      {uploading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-foreground" />
                      ) : (
                        <Upload className="h-5 w-5 text-foreground/70 transition-transform group-hover:-translate-y-1" />
                      )}
                    </div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground">
                      {item.title}
                    </div>
                    <div className="font-mono mt-1 text-[10px] text-[var(--meta)]">
                      {item.date} · {item.location}
                    </div>
                    <p className="mt-3 text-[11px] text-foreground/60">
                      Drop <strong>IMG_1277.heic</strong> here or click to upload
                    </p>
                    <span className="font-mono mt-3 inline-flex items-center gap-1 rounded border border-[var(--rule)] px-2 py-0.5 text-[9px] uppercase tracking-wider text-[var(--meta)]">
                      <Sparkles className="h-2.5 w-2.5" /> Auto Color Correction
                    </span>
                  </div>
                ) : (
                  <div
                    onClick={() => handleSelect(index)}
                    data-cursor="link"
                    className="group relative block w-full cursor-pointer overflow-hidden rounded-lg border border-[var(--rule)] bg-[var(--cream-soft)] transition-colors duration-300 hover:border-foreground/30"
                  >
                    <img
                      src={imgSrc}
                      alt={item.title}
                      loading="lazy"
                      onError={() => {
                        setImageErrors((prev) => ({ ...prev, [item.id]: true }));
                      }}
                      className="block h-auto w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Interactive Lightbox with Dynamic Directional Motion */}
      <AnimatePresence>
        {activeItem && selectedItemIndex !== null && !imageErrors[activeItem.id] && (
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
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-[0.26em]">
                  {String(selectedItemIndex + 1).padStart(2, "0")} /{" "}
                  {String(galleryItems.length).padStart(2, "0")}
                </span>
                <span className="text-[12px] font-mono text-white/90">
                  {activeItem.title}
                </span>
              </div>

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
                  <img
                    src={`${activeItem.src}?v=${cacheBust}`}
                    alt={activeItem.title}
                    className="max-h-[78vh] max-w-[90vw] rounded-md object-contain shadow-2xl select-none"
                  />
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
                        src={`${thumb.src}?v=${cacheBust}`}
                        alt=""
                        className="h-full w-full object-cover"
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
