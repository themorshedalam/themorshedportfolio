"use client";

import { motion } from "framer-motion";
import { profile, projects } from "@/lib/projects";
import { ProjectImage } from "./project-image";

type Props = {
  onPickProject: (id: string) => void;
};

/**
 * Clean, polished homepage — an editorial cover.
 * Minimal text (name + tagline only; the full bio lives on About),
 * a clean 2×2 grid of featured work with curved image corners.
 */
export function HeroView({ onPickProject }: Props) {
  const featured = projects.filter((p) => p.featured);

  return (
    <div className="scroll-cream relative h-full overflow-y-auto bg-[var(--cream)]">
      <div className="mx-auto max-w-[1100px] px-6 pt-16 pb-24 md:px-12 md:pt-20">
        {/* Hero name — smaller, refined */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono-display text-balance text-[clamp(2rem,5vw,3.25rem)] leading-[1.1] text-foreground"
        >
          {profile.name}
        </motion.h1>

        {/* Roles + tagline — minimal text, no full bio (that's on About) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-[640px]"
        >
          <div className="font-mono-label flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] uppercase tracking-[0.44em] text-[var(--meta)]">
            {profile.roles.map((r, i) => (
              <span key={r} className="flex items-center gap-2">
                {r}
                {i < profile.roles.length - 1 && (
                  <span className="text-[var(--rule)]">·</span>
                )}
              </span>
            ))}
          </div>
          <p className="font-serif-display text-balance mt-4 text-[clamp(1.15rem,2vw,1.5rem)] leading-[1.3] text-foreground/80">
            {profile.tagline}
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-14 border-t border-[var(--rule)]"
        />

        {/* Featured Work — clean 2×2 grid, curved cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10"
        >
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="font-serif-display text-[clamp(1.5rem,3vw,1.95rem)] leading-tight text-foreground">
              Selected Work
            </h2>
            <span className="font-mono-label text-[11px] tabular-nums text-[var(--meta)]">
              {String(featured.length).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {featured.map((p, i) => (
              <motion.button
                key={p.id}
                onClick={() => onPickProject(p.id)}
                data-cursor="view"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.07, duration: 0.6 }}
                className="group text-left"
              >
                <div className="group/card relative mb-3">
                  <ProjectImage
                    src={p.images[0].src}
                    alt={p.title}
                    caption={p.client}
                    index={i}
                    aspectClass="aspect-[4/3] w-full transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.03]"
                  />
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono-display text-[16px] leading-tight text-foreground transition-opacity group-hover:opacity-50">
                    {p.title}
                  </span>
                  <span className="font-mono-label text-[10px] tabular-nums text-[var(--meta)]">
                    {p.year}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Footer note */}
        <div className="font-mono-label mt-20 flex flex-wrap items-baseline justify-between gap-4 border-t border-[var(--rule)] pt-6 text-[11px] uppercase tracking-[0.24em] text-[var(--meta)]">
          <span>Open for collaborations, {profile.year}</span>
          <button
            onClick={() => onPickProject(projects[0].id)}
            data-cursor="link"
            className="link-underline text-foreground/80 hover:text-foreground"
          >
            Begin with 01 →
          </button>
        </div>
      </div>
    </div>
  );
}
