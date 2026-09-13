"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/projects";

const experience = [
  {
    role: "Graphic & Motion Graphics Designer",
    org: "ENTERTAINER FZ LLC",
    period: "Present",
    location: "Dubai",
    note: "Creating innovative visual content across Meta Ads, EDM, CRM, In-App, Push Notifications, and Paid Media. Blending art direction with AI tools like VEO3 and Runway to deliver impactful creative solutions.",
  },
  {
    role: "Motion Designer",
    org: "Creative Agency",
    period: "Previous",
    location: "Dubai",
    note: "Campaign films, social cutdowns, and motion graphics for automotive, hospitality, and seasonal retail clients.",
  },
  {
    role: "Video Editor & Designer",
    org: "Production House",
    period: "Previous",
    location: "Bangladesh",
    note: "Edit assistant and design work; introduced to the discipline of pace, rhythm, and visual storytelling.",
  },
];

const capabilities = [
  { group: "Motion", items: ["After Effects", "Cinema 4D", "Frame by Frame", "Type in Motion"] },
  { group: "AI Tools", items: ["VEO3", "Runway", "AI Workflows", "Generative"] },
  { group: "Edit", items: ["Premiere Pro", "DaVinci Resolve", "Color", "Sound Design"] },
  { group: "Brand", items: ["Meta Ads", "EDM", "CRM", "Paid Media"] },
];

const awards = [
  { name: "Cannes Young Lions", category: "Film — Shortlist", year: "2025" },
  { name: "Dubai Lynx", category: "Motion — Bronze", year: "2024" },
  { name: "Sharjah Film Festival", category: "Short — Official Selection", year: "2023" },
];

export function AboutView() {
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
          <span>/personal</span>
          <span className="text-[var(--rule)]">/</span>
          <span>About</span>
        </motion.div>

        {/* Hero name */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono-display text-balance text-[clamp(2.25rem,6vw,3.75rem)] leading-[1.1] text-foreground"
        >
          {profile.name}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono-label mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] uppercase tracking-[0.44em] text-[var(--meta)]"
        >
          {profile.roles.map((r, i) => (
            <span key={r} className="flex items-center gap-2">
              {r}
              {i < profile.roles.length - 1 && (
                <span className="text-[var(--rule)]">·</span>
              )}
            </span>
          ))}
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 max-w-[640px] space-y-5"
        >
          {profile.bio.map((para, i) => (
            <p
              key={i}
              className="font-body-sans text-balance text-[16px] leading-[1.55] text-foreground/80"
            >
              {i === 1 ? (
                <>
                  {para.split("The Entertainer")[0]}
                  <a
                    href="#"
                    data-cursor="link"
                    className="link-underline text-foreground"
                  >
                    The Entertainer
                  </a>
                  {para.split("The Entertainer")[1]}
                </>
              ) : (
                para
              )}
            </p>
          ))}
        </motion.div>

        {/* Capabilities */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7 }}
          className="mt-20 border-t border-[var(--rule)] pt-10"
        >
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="font-serif-display text-[clamp(1.5rem,3vw,1.95rem)] leading-tight text-foreground">
              Capabilities
            </h2>
            <span className="font-mono-label text-[11px] tabular-nums text-[var(--meta)]">
              04 disciplines
            </span>
          </div>
          <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((c) => (
              <div key={c.group}>
                <div className="font-mono-label mb-3 text-[10px] uppercase tracking-[0.24em] text-[var(--meta)]">
                  {c.group}
                </div>
                <ul className="space-y-2">
                  {c.items.map((item) => (
                    <li
                      key={item}
                      className="font-serif-display text-[18px] leading-snug text-foreground/85"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Work experience */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7 }}
          className="mt-20 border-t border-[var(--rule)] pt-10"
        >
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="font-serif-display text-[clamp(1.5rem,3vw,1.95rem)] leading-tight text-foreground">
              Work Experience
            </h2>
            <span className="font-mono-label text-[11px] tabular-nums text-[var(--meta)]">
              {experience.length} roles
            </span>
          </div>
          <ul className="space-y-8">
            {experience.map((e) => (
              <li
                key={e.org}
                className="grid gap-2 border-b border-[var(--rule)] pb-8 md:grid-cols-[1.4fr_1fr] md:gap-12"
              >
                <div>
                  <div className="font-mono-label text-[11px] uppercase tracking-[0.24em] text-[var(--meta)]">
                    {e.period}
                  </div>
                  <h3 className="font-serif-display mt-1 text-[22px] leading-tight text-foreground">
                    {e.role}
                  </h3>
                  <div className="font-body-sans mt-0.5 text-[14px] text-foreground/70">
                    {e.org} · {e.location}
                  </div>
                </div>
                <p className="font-body-sans text-[14px] leading-[1.65] text-foreground/70">
                  {e.note}
                </p>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Recognition */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7 }}
          className="mt-20 border-t border-[var(--rule)] pt-10"
        >
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="font-serif-display text-[clamp(1.5rem,3vw,1.95rem)] leading-tight text-foreground">
              Recognition
            </h2>
            <span className="font-mono-label text-[11px] tabular-nums text-[var(--meta)]">
              {awards.length} honors
            </span>
          </div>
          <ul className="divide-y divide-[var(--rule)]">
            {awards.map((a) => (
              <li
                key={a.name}
                className="flex items-baseline justify-between gap-6 py-4"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-serif-display text-[18px] text-foreground">
                    {a.name}
                  </span>
                  <span className="font-body-sans text-[13px] text-foreground/60">
                    {a.category}
                  </span>
                </div>
                <span className="font-mono-label text-[12px] tabular-nums text-[var(--meta)]">
                  {a.year}
                </span>
              </li>
            ))}
          </ul>
        </motion.section>
      </div>
    </div>
  );
}
