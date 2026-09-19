"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { projects, type Project } from "@/lib/projects";
import { Lightbox } from "./lightbox";
import { ProjectImage } from "./project-image";
import { ProjectVideo } from "./project-video";
import { useLang } from "@/lib/lang-context";

type Props = {
  project: Project;
  transitionKey: string;
};

export function ProjectView({ project, transitionKey }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({ container: containerRef });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  });

  // Reset scroll on project change
  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [transitionKey, containerRef]);

  const currentIndex = projects.findIndex((p) => p.id === project.id);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const projectIndex = currentIndex;

  return (
    <div className="relative flex h-full flex-col bg-[var(--cream)]">
      {/* Scroll progress line on right edge (transparent track, only fill shows) */}
      <div className="absolute right-0 top-0 z-20 h-full w-px">
        <motion.div
          style={{ scaleY: progress }}
          className="scroll-progress absolute left-0 top-0 h-full w-px origin-top bg-foreground"
        />
      </div>

      {/* Scrollable content */}
      <div
        ref={containerRef}
        className="scroll-cream relative h-full overflow-y-auto"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={transitionKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-[1100px] px-6 pt-10 pb-24 md:px-12 md:pt-14"
          >
            {/* Breadcrumb / slug */}
            <div className="font-mono-label mb-10 flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-[var(--meta)]">
              <span className="h-1 w-1 rounded-full bg-foreground" />
              <span>/{project.slug}</span>
              <span className="text-[var(--rule)]">/</span>
              <span>Case Study</span>
            </div>

            {/* Title block */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-10"
            >
              <h1 className="font-mono-display text-balance text-[clamp(1.4rem,3.5vw,2.25rem)] leading-[1.1] text-foreground">
                {project.title}
              </h1>
            </motion.div>

            {/* Meta grid */}
            <motion.dl
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-12 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-[var(--rule)] py-6 md:grid-cols-2"
            >
              {[
                { label: "Client", value: project.client },
                { label: "Year", value: project.year },
              ].map((m) => (
                <div key={m.label}>
                  <dt className="font-mono-label mb-1 text-[10px] uppercase tracking-[0.24em] text-[var(--meta)]">
                    {m.label}
                  </dt>
                  <dd className="font-mono-display text-[14px] leading-snug text-foreground">
                    {m.value}
                  </dd>
                </div>
              ))}
            </motion.dl>

            {/* Video gallery — inline players */}
            {project.videos && project.videos.length > 0 && (
              <div className="mb-16 space-y-16 md:space-y-24">
                {project.videos.map((vid, i) => (
                  <motion.figure
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="group"
                  >
                    <div className="font-mono-label mb-4 flex items-baseline justify-between">
                      <span className="text-[11px] uppercase tracking-[0.24em] text-[var(--meta)]">
                        {vid.caption}
                      </span>
                      <span className="text-[11px] tabular-nums text-[var(--meta)]">
                        Video
                      </span>
                    </div>
                    <ProjectVideo src={vid.src} caption={vid.caption} />
                  </motion.figure>
                ))}
              </div>
            )}

            {/* Image gallery — vertical stack, scroll reveals */}
            {project.images.length > 0 && (
            <div className="space-y-12 md:space-y-16">
              {(() => {
                // Build groups: full-width items individually, gridGroup items together
                const groups: { items: typeof project.images; startIndex: number; gridCols?: number; hasSide?: boolean }[] = [];
                let currentGroup: { items: typeof project.images; startIndex: number; gridCols?: number; hasSide?: boolean } | null = null;
                project.images.forEach((img, i) => {
                  const groupKey = img.gridGroup ?? (img.grid ? "grid" : null);
                  if (groupKey !== null) {
                    if (!currentGroup || currentGroup.gridCols !== img.gridCols) {
                      if (currentGroup) groups.push(currentGroup);
                      currentGroup = { items: [], startIndex: i, gridCols: img.gridCols, hasSide: false };
                    }
                    currentGroup.items.push(img);
                    if (img.side) currentGroup.hasSide = true;
                  } else {
                    if (currentGroup) { groups.push(currentGroup); currentGroup = null; }
                    groups.push({ items: [img], startIndex: i });
                  }
                });
                if (currentGroup) groups.push(currentGroup);

                return groups.map((group, gi) => {
                  const isGrid = group.items.length > 1 && (group.items[0].grid || group.items[0].gridGroup !== undefined);
                  if (isGrid) {
                    // Check for explicit CSS Grid placement (gridCol + gridRowStart)
                    const hasExplicitPlacement = group.items[0].gridCol !== undefined && group.items[0].gridRowStart !== undefined;
                    const cols = group.gridCols || 2;
                    const colClass = cols === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2";
                    // If side items exist, use flex layout
                    if (group.hasSide) {
                      const frameItems = group.items.filter((img) => !img.side);
                      const sideItems = group.items.filter((img) => img.side);
                      const sideBase = group.startIndex + frameItems.length;
                      const frameCols = group.gridCols || 2;
                      const frameColClass = frameCols === 1 ? "grid-cols-1" : frameCols === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2";
                      return (
                        <div key={gi} className="flex flex-col gap-4 md:flex-row md:gap-6">
                          {frameItems.length > 0 && (
                            <div className={`grid ${frameColClass} gap-4 md:gap-6 md:flex-1`}>
                              {frameItems.map((img, ii) => (
                                <GalleryImage key={gi + "-f" + ii} src={img.src} caption={img.caption} behanceUrl={img.behanceUrl} projectTitle={project.title} index={group.startIndex + ii + 1} total={project.images.length} projectIndex={projectIndex} onOpen={() => setLightbox(img.src)} compact />
                              ))}
                            </div>
                          )}
                          {sideItems.length > 0 && (
                            <div className="flex flex-col gap-4 md:w-[35%] md:gap-6">
                              {sideItems.map((img, ii) => (
                                <GalleryImage key={gi + "-s" + ii} src={img.src} caption={img.caption} behanceUrl={img.behanceUrl} projectTitle={project.title} index={sideBase + ii + 1} total={project.images.length} projectIndex={projectIndex} onOpen={() => setLightbox(img.src)} compact />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }
                    // Explicit CSS Grid placement (portrait spanning rows, etc.)
                    if (hasExplicitPlacement) {
                      return (
                        <div key={gi} className="grid grid-cols-1 md:grid-cols-[1fr_35%] gap-4 md:gap-6">
                          {group.items.map((img, ii) => (
                            <GalleryImage
                              key={gi + "-" + ii}
                              src={img.src}
                              caption={img.caption}
                              behanceUrl={img.behanceUrl}
                              projectTitle={project.title}
                              index={group.startIndex + ii + 1}
                              total={project.images.length}
                              projectIndex={projectIndex}
                              onOpen={() => setLightbox(img.src)}
                              compact
                              gridCol={img.gridCol}
                              gridRowStart={img.gridRowStart}
                              gridRowSpan={img.gridRowSpan}
                            />
                          ))}
                        </div>
                      );
                    }
                    // Regular grid
                    return (
                      <div key={gi} className={`grid ${colClass} gap-4 md:gap-6`}>
                        {group.items.map((img, ii) => (
                          <GalleryImage key={gi + "-" + ii} src={img.src} caption={img.caption} behanceUrl={img.behanceUrl} projectTitle={project.title} index={group.startIndex + ii + 1} total={project.images.length} projectIndex={projectIndex} onOpen={() => setLightbox(img.src)} compact />
                        ))}
                      </div>
                    );
                  }
                  return (
                    <GalleryImage key={gi} src={group.items[0].src} caption={group.items[0].caption} behanceUrl={group.items[0].behanceUrl} projectTitle={project.title} index={group.startIndex + 1} total={project.images.length} projectIndex={projectIndex} onOpen={() => setLightbox(group.items[0].src)} />
                  );
                });
              })()}
            </div>
            )}

            {/* Next project CTA */}
            <NextProject
              project={nextProject}
              onSelect={() => {
                // Will be handled by parent via custom event
                window.dispatchEvent(
                  new CustomEvent("select-project", { detail: nextProject.id })
                );
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function GalleryImage({
  src,
  caption,
  behanceUrl,
  projectTitle,
  index,
  total,
  projectIndex,
  onOpen,
  compact,
  gridCol,
  gridRowStart,
  gridRowSpan,
}: {
  src: string;
  caption: string;
  behanceUrl?: string;
  projectTitle: string;
  index: number;
  total: number;
  projectIndex: number;
  onOpen: () => void;
  compact?: boolean;
  gridCol?: number;
  gridRowStart?: number;
  gridRowSpan?: number;
}) {
  const gridStyle: React.CSSProperties = {};
  if (gridCol) gridStyle.gridColumn = String(gridCol);
  if (gridRowStart && gridRowSpan) gridStyle.gridRow = `${gridRowStart} / span ${gridRowSpan}`;
  else if (gridRowStart) gridStyle.gridRow = String(gridRowStart);

  return (
    <motion.figure
      style={gridStyle}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div className={`font-mono-label mb-2 flex items-baseline justify-between ${compact ? "hidden" : "mb-4"}`}>
        <span className="text-[11px] uppercase tracking-[0.24em] text-[var(--meta)]">
          {caption}
        </span>
        <div className="flex items-center gap-4">
          {behanceUrl && (
            <a
              href={behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="link-underline text-[11px] uppercase tracking-[0.24em] text-foreground transition-opacity hover:opacity-60"
            >
              {behanceUrl.includes("figma.com") ? "View in Figma →" : "Watch on Behance →"}
            </a>
          )}
          <span className="text-[11px] tabular-nums text-[var(--meta)]">
            {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
      <button
        onClick={onOpen}
        data-cursor="view"
        className="group/img relative block w-full text-left"
      >
        <img
          src={src}
          alt={projectTitle}
          loading="lazy"
          className="block w-full h-auto rounded-2xl border border-[var(--rule)]"
        />
        <div className="absolute inset-0 bg-foreground/0 transition-colors duration-500 group-hover/img:bg-foreground/[0.04] rounded-2xl" />
        <span className="font-mono-label absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-foreground/20 bg-[var(--cream)]/80 text-[10px] uppercase tracking-[0.24em] opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover/img:opacity-100">
          View
        </span>
      </button>
    </motion.figure>
  );
}

function NextProject({
  project,
  onSelect,
}: {
  project: Project;
  onSelect: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mt-24 border-t border-[var(--rule)] pt-10"
    >
      <div className="font-mono-label mb-3 text-[10px] uppercase tracking-[0.24em] text-[var(--meta)]">
        Next Project — {project.index}
      </div>
      <button
        onClick={onSelect}
        data-cursor="view"
        className="group flex w-full items-center justify-between gap-6 text-left"
      >
        <span className="font-mono-display text-balance text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-foreground transition-opacity group-hover:opacity-50">
          {project.title}
        </span>
        <span className="font-mono-label hidden shrink-0 text-[11px] uppercase tracking-[0.24em] text-foreground md:block">
          Continue →
        </span>
      </button>
    </motion.div>
  );
}
