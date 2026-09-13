"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, profile, type Project } from "@/lib/projects";

type Props = {
  activeId: string | null;
  onSelect: (id: string) => void;
};

export function Sidebar({ activeId, onSelect }: Props) {
  const activeIndex = activeId
    ? projects.findIndex((p) => p.id === activeId)
    : -1;
  const total = projects.length;

  return (
    <aside className="flex h-full flex-col bg-[var(--sidebar)]">
      {/* Projects header */}
      <div className="flex items-baseline justify-between px-6 pt-7 pb-5 md:px-8">
        <h2 className="font-mono-label text-[12px] uppercase tracking-[0.24em] text-foreground">
          Projects
        </h2>
        <span className="font-mono-label text-[11px] tabular-nums text-[var(--meta)]">
          {activeIndex >= 0
            ? `${String(activeIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`
            : `— / ${String(total).padStart(2, "0")}`}
        </span>
      </div>

      {/* Scrollable project list */}
      <ProjectList activeId={activeId} onSelect={onSelect} />

      {/* Footer pinned at bottom of sidebar */}
      <SidebarFooter />
    </aside>
  );
}

function ProjectList({ activeId, onSelect }: Props) {
  return (
    <nav className="scroll-cream min-h-0 flex-1 overflow-y-auto px-6 pb-6 md:px-8">
      <ul className="space-y-1">
        {projects.map((p, i) => (
          <ProjectItem
            key={p.id}
            project={p}
            active={p.id === activeId}
            onSelect={onSelect}
            delay={i * 0.04}
          />
        ))}
      </ul>
    </nav>
  );
}

function ProjectItem({
  project,
  active,
  onSelect,
  delay,
}: {
  project: Project;
  active: boolean;
  onSelect: (id: string) => void;
  delay: number;
}) {
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPreviewPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <li>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          ref={ref}
          onMouseMove={handleMove}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => onSelect(project.id)}
          data-cursor="view"
          className="group relative flex w-full items-baseline gap-2 py-2 text-left"
        >
          {/* Active marker */}
          <span
            className={`absolute left-0 top-1/2 h-[1px] -translate-y-1/2 bg-foreground transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
              active ? "w-3" : "w-0 group-hover:w-2"
            }`}
            style={{ marginLeft: -16 }}
          />

          {/* Title + index */}
          <span className="flex items-baseline gap-2 pl-0">
            <span
              className={`font-mono-display text-[17px] leading-[1.15] transition-all duration-300 ${
                active
                  ? "text-foreground"
                  : "text-foreground/45 group-hover:text-foreground/80"
              }`}
            >
              {project.title}
            </span>
            <sup className="font-mono-label text-[9px] tabular-nums text-[var(--meta)]">
              {project.index}
            </sup>
          </span>

          {/* Year tag (subtle, appears on hover) */}
          <span
            className={`font-mono-label ml-auto text-[11px] tabular-nums text-[var(--meta)] transition-opacity duration-300 ${
              hover || active ? "opacity-100" : "opacity-0"
            }`}
          >
            {project.year}
          </span>

          {/* Floating preview thumbnail on hover */}
          <AnimatePresence>
            {hover && !active && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none absolute z-50 hidden lg:block"
                style={{
                  left: previewPos.x + 24,
                  top: previewPos.y - 60,
                }}
              >
                <PreviewThumb project={project} />
                <div className="font-mono-label mt-1 text-[9px] uppercase tracking-[0.24em] text-[var(--meta)]">
                  {project.client}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </motion.div>
    </li>
  );
}

function PreviewThumb({ project }: { project: Project }) {
  const idx = parseInt(project.index) - 1;
  const themes = [
    { from: "#3a2e22", to: "#1a1410" },
    { from: "#16182b", to: "#070a18" },
    { from: "#1d2f24", to: "#0e1812" },
    { from: "#2a1d10", to: "#150d05" },
    { from: "#181e26", to: "#080b10" },
    { from: "#2b1417", to: "#150a0b" },
  ];
  const theme = themes[idx % themes.length];
  return (
    <div className="img-grain relative h-28 w-44 overflow-hidden rounded-xl border border-[var(--rule)] shadow-xl">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 100% at 30% 20%, ${theme.from} 0%, ${theme.to} 70%)`,
        }}
      />
      <img
        src={project.images[0].src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      <div className="font-mono-label absolute bottom-1.5 left-2 text-[9px] uppercase tracking-[0.24em] text-white/80">
        {project.title}
      </div>
    </div>
  );
}

function SidebarFooter() {
  return (
    <div className="border-t border-[var(--rule)] px-6 py-5 md:px-8">
      <div className="font-mono-label space-y-3 text-[11px] leading-relaxed text-[var(--meta)]">
        <div className="flex items-baseline justify-between">
          <span className="uppercase tracking-[0.24em]">Location</span>
          <span className="text-foreground/80">{profile.location}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="uppercase tracking-[0.24em]">Social</span>
          <div className="flex gap-3">
            {profile.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                data-cursor="link"
                className="link-underline text-foreground/80 hover:text-foreground"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-baseline justify-between border-t border-[var(--rule)] pt-3">
          <span>© {profile.year}</span>
          <span>All rights reserved</span>
        </div>
      </div>
    </div>
  );
}
