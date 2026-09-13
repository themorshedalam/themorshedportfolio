"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { projects, type Project } from "@/lib/projects";
import { Lightbox } from "./lightbox";
import { ProjectImage } from "./project-image";

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
              <div className="font-mono-label mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.44em] text-[var(--meta)]">
                {project.tags.map((t, i) => (
                  <span key={t} className="flex items-center gap-3">
                    {t}
                    {i < project.tags.length - 1 && (
                      <span className="text-[var(--rule)]">·</span>
                    )}
                  </span>
                ))}
              </div>
              <h1 className="font-mono-display text-balance text-[clamp(2rem,5vw,3.25rem)] leading-[1.1] text-foreground">
                {project.title}
              </h1>
            </motion.div>

            {/* Meta grid */}
            <motion.dl
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-12 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-[var(--rule)] py-6 md:grid-cols-4"
            >
              {[
                { label: "Client", value: project.client },
                { label: "Year", value: project.year },
                { label: "Role", value: project.role },
                { label: "Scope", value: project.scope },
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

            {/* Description + Brief */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-16 grid gap-8 md:grid-cols-[1.4fr_1fr] md:gap-12"
            >
              <div>
                <p className="font-body-sans text-balance text-[17px] leading-[1.6] text-foreground/85">
                  {project.description}
                </p>
              </div>
              <div className="md:border-l md:border-[var(--rule)] md:pl-12">
                <div className="font-mono-label mb-2 text-[10px] uppercase tracking-[0.24em] text-[var(--meta)]">
                  The Brief
                </div>
                <p className="font-body-sans text-[14px] leading-[1.65] text-foreground/70">
                  {project.brief}
                </p>
              </div>
            </motion.div>

            {/* Image gallery — vertical stack, scroll reveals */}
            <div className="space-y-16 md:space-y-24">
              {project.images.map((img, i) => (
                <GalleryImage
                  key={i}
                  src={img.src}
                  caption={img.caption}
                  projectTitle={project.title}
                  index={i + 1}
                  total={project.images.length}
                  projectIndex={projectIndex}
                  onOpen={() => setLightbox(img.src)}
                />
              ))}
            </div>

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
  projectTitle,
  index,
  total,
  projectIndex,
  onOpen,
}: {
  src: string;
  caption: string;
  projectTitle: string;
  index: number;
  total: number;
  projectIndex: number;
  onOpen: () => void;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div className="font-mono-label mb-4 flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-[0.24em] text-[var(--meta)]">
          {caption}
        </span>
        <span className="text-[11px] tabular-nums text-[var(--meta)]">
          {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
      <button
        onClick={onOpen}
        data-cursor="view"
        className="group/img relative block w-full text-left"
      >
        <ProjectImage
          src={src}
          alt={projectTitle}
          caption={caption}
          index={projectIndex}
          aspectClass="aspect-[16/9] w-full"
        />
        <div className="absolute inset-0 bg-foreground/0 transition-colors duration-500 group-hover/img:bg-foreground/[0.04]" />
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
