"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/projects";

const roles = profile.roles;

const timeline = [
  {
    year: "2026",
    title: "Selected — Cannes Young Lions",
    org: "Film Craft",
    note: "Shortlisted for a regional milestone campaign.",
  },
  {
    year: "2025",
    title: "Lead, Motion Direction",
    org: "The Entertainer — Dubai",
    note: "25-year anniversary campaign across film, social, and OOH.",
  },
  {
    year: "2024",
    title: "Bronze — Dubai Lynx",
    org: "Motion Design",
    note: "Recognised for a launch film in the automotive category.",
  },
  {
    year: "2023",
    title: "Studio — Independent",
    org: "MA — Studio founded",
    note: "Began taking on campaign film and launch work directly.",
  },
  {
    year: "2020",
    title: "Freelance Motion Designer",
    org: "Dubai / Remote",
    note: "Campaign films and social cutdowns across hospitality, retail, and automotive.",
  },
  {
    year: "2018",
    title: "Junior Video Editor",
    org: "Studio Production House — Cairo",
    note: "Edit assistant on long-form commercial work.",
  },
];

const education = [
  {
    school: "American University in Dubai",
    program: "BFA, Visual Communication",
    period: "2014 — 2018",
    note: "Concentration in motion and time-based media.",
  },
];

export function ResumeView() {
  return (
    <div className="scroll-cream relative h-full overflow-y-auto bg-[var(--cream)]">
      <div className="mx-auto max-w-[1100px] px-6 pt-12 pb-24 md:px-12 md:pt-16">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono-label mb-12 flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-[var(--meta)]"
        >
          <span className="h-1 w-1 rounded-full bg-foreground" />
          <span>/resume</span>
          <span className="text-[var(--rule)]">/</span>
          <span>CV · {profile.year}</span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-[var(--rule)] pb-10"
        >
          <div>
            <h1 className="font-serif-display text-balance text-[clamp(2.5rem,6vw,4rem)] leading-[1.02] text-foreground">
              {profile.name}
            </h1>
            <div className="font-mono-label mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] uppercase tracking-[0.44em] text-[var(--meta)]">
              {roles.map((r, i) => (
                <span key={r} className="flex items-center gap-2">
                  {r}
                  {i < roles.length - 1 && (
                    <span className="text-[var(--rule)]">·</span>
                  )}
                </span>
              ))}
            </div>
          </div>
          <a
            href={profile.resumeUrl}
            data-cursor="link"
            className="font-mono-label link-underline text-[12px] uppercase tracking-[0.24em] text-foreground"
          >
            Download PDF →
          </a>
        </motion.div>

        {/* Timeline */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="font-serif-display text-[clamp(1.5rem,3vw,1.95rem)] leading-tight text-foreground">
              Timeline
            </h2>
            <span className="font-mono-label text-[11px] tabular-nums text-[var(--meta)]">
              {timeline.length} entries
            </span>
          </div>
          <ol className="relative">
            {timeline.map((t, i) => (
              <li
                key={i}
                className="grid grid-cols-[auto_1fr] gap-6 border-b border-[var(--rule)] py-6 md:grid-cols-[120px_1fr] md:gap-12"
              >
                <div className="font-mono-label text-[13px] tabular-nums text-foreground">
                  {t.year}
                </div>
                <div>
                  <h3 className="font-serif-display text-[20px] leading-tight text-foreground">
                    {t.title}
                  </h3>
                  <div className="font-mono-label mt-0.5 text-[11px] uppercase tracking-[0.24em] text-[var(--meta)]">
                    {t.org}
                  </div>
                  <p className="font-body-sans mt-2 max-w-[560px] text-[14px] leading-[1.65] text-foreground/70">
                    {t.note}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </motion.section>

        {/* Education */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7 }}
          className="border-t border-[var(--rule)] pt-10"
        >
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="font-serif-display text-[clamp(1.5rem,3vw,1.95rem)] leading-tight text-foreground">
              Education
            </h2>
          </div>
          <ul>
            {education.map((e) => (
              <li key={e.school} className="grid gap-2 md:grid-cols-[1fr_1fr] md:gap-12">
                <div>
                  <h3 className="font-serif-display text-[20px] leading-tight text-foreground">
                    {e.school}
                  </h3>
                  <div className="font-body-sans mt-0.5 text-[14px] text-foreground/70">
                    {e.program}
                  </div>
                </div>
                <div>
                  <div className="font-mono-label text-[11px] uppercase tracking-[0.24em] text-[var(--meta)]">
                    {e.period}
                  </div>
                  <p className="font-body-sans mt-2 text-[14px] leading-[1.65] text-foreground/70">
                    {e.note}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </motion.section>
      </div>
    </div>
  );
}
