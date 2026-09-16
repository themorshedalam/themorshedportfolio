"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/projects";

const experience = [
  {
    role: "Graphic & Motion Graphics Designer",
    org: "the ENTERTAINER FZ LLC",
    type: "Full-time",
    period: "Feb 2024 — Present",
    duration: "2 yrs 8 mos",
    location: "Dubai, UAE · On-site",
    note: "Design and produce high-converting visual assets across Meta Ads, Paid Media, EDMs, CRM campaigns, In-App visuals, and Push Notifications to drive brand growth and user engagement.",
  },
  {
    role: "Graphic & Multimedia Designer",
    org: "DigiZone Media",
    type: "Full-time",
    period: "Aug 2022 — Dec 2023",
    duration: "1 yr 5 mos",
    location: "Dubai, UAE · On-site",
    note: "",
  },
  {
    role: "Motion Graphics Designer",
    org: "Union Church",
    type: "Freelance",
    period: "Apr 2020 — Feb 2022",
    duration: "1 yr 11 mos",
    location: "Dubai, UAE · Remote",
    note: "Seasonal Projects",
  },
];

const capabilities = [
  { group: "Motion", items: ["After Effects", "Cinema 4D", "Frame by Frame", "Type in Motion"] },
  { group: "AI Tools", items: ["VEO3", "Runway", "AI Workflows", "Generative"] },
  { group: "Edit", items: ["Premiere Pro", "DaVinci Resolve", "Color", "Sound Design"] },
];

const recommendations = [
  {
    name: "Logan Cain",
    title: "Marketing Manager — Middle East, NAMAA (an ATOMS Company)",
    date: "Aug 2026",
    relationship: "Worked with Morshed at the ENTERTAINER",
    initials: "LC",
    color: "#2563eb",
    photo: "/projects/logan.jpg",
    text: "I had the pleasure of working with Morshed at the ENTERTAINER, where I worked as Performance Marketing Manager and regularly collaborated with him across motion graphics, video editing and creative production. Morshed was always someone I could rely on to turn a brief into strong, engaging creative that performed.",
  },
  {
    name: "May Doukanish",
    title: "Content Disruptor",
    date: "Aug 2026",
    relationship: "Managed Morshed directly",
    initials: "MD",
    color: "#7c3aed",
    photo: "/projects/may.jpg",
    text: "I had the pleasure of working with Morshed, and I was always impressed by his creativity, attention to detail, and ability to bring ideas to life through animation. He has a great eye for visual storytelling and consistently delivered work that exceeded expectations.",
  },
  {
    name: "Olivia Hamilton",
    title: "UAE Marketing, the ENTERTAINER",
    date: "Aug 2026",
    relationship: "Worked with Morshed on the same team",
    initials: "OH",
    color: "#059669",
    photo: "/projects/olivia.jpg",
    text: "I had the pleasure of working alongside Morshed and can confidently say he was a fantastic colleague and a real asset to the team. Hardworking, reliable, and always bringing a positive, collaborative attitude to everything he does.",
  },
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
          <span>/about</span>
        </motion.div>

        {/* Hero section — name/title/summary on left, photo on right */}
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-16">
          {/* Left — name, title, summary */}
          <div className="min-w-0 flex-1">
            {/* Hero name — 20% smaller */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono-display text-balance text-[clamp(1.44rem,3.84vw,2.4rem)] leading-[1.1] text-foreground"
            >
              {profile.name}
            </motion.h1>

            {/* Title — closer tracking, | separator */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono-label mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] uppercase tracking-[0.08em] text-[var(--meta)]"
            >
              {profile.roles.map((r, i) => (
                <span key={r} className="flex items-center gap-2">
                  {r}
                  {i < profile.roles.length - 1 && (
                    <span className="text-[var(--rule)]">|</span>
                  )}
                </span>
              ))}
            </motion.div>

            {/* Summary */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-body-sans text-balance mt-10 max-w-[560px] text-[17px] leading-[1.6] text-foreground/80"
            >
              {profile.bio[0]}
            </motion.p>
          </div>

          {/* Right — portrait photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0"
          >
            <img
              src="/projects/morshed-portrait.png"
              alt="Morshed Alam — Motion Graphics Designer in Dubai"
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
              onClick={(e) => e.preventDefault()}
              style={{ pointerEvents: "none", userSelect: "none", WebkitUserDrag: "none" }}
              className="w-[200px] rounded-2xl border border-[var(--rule)] object-cover md:w-[260px]"
            />
          </motion.div>
        </div>

        {/* Capabilities */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7 }}
          className="mt-20 border-t border-[var(--rule)] pt-10"
        >
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="font-mono-display text-[clamp(1.25rem,2.5vw,1.6rem)] leading-tight text-foreground">
              Capabilities
            </h2>
            <span className="font-mono-label text-[11px] tabular-nums text-[var(--meta)]">
              03 disciplines
            </span>
          </div>
          <div className="grid gap-x-6 gap-y-8 sm:grid-cols-3">
            {capabilities.map((c) => (
              <div key={c.group}>
                <div className="font-mono-label mb-3 text-[10px] uppercase tracking-[0.24em] text-[var(--meta)]">
                  {c.group}
                </div>
                <ul className="space-y-2">
                  {c.items.map((item) => (
                    <li
                      key={item}
                      className="font-mono-display text-[14px] leading-snug text-foreground/85"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Work Experience — real data from LinkedIn */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7 }}
          className="mt-20 border-t border-[var(--rule)] pt-10"
        >
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="font-mono-display text-[clamp(1.25rem,2.5vw,1.6rem)] leading-tight text-foreground">
              Experience
            </h2>
            <span className="font-mono-label text-[11px] tabular-nums text-[var(--meta)]">
              {experience.length} roles
            </span>
          </div>
          <ul className="space-y-0">
            {experience.map((e) => (
              <li
                key={e.org}
                className="grid gap-2 border-b border-[var(--rule)] py-7 md:grid-cols-[1.3fr_1fr] md:gap-12"
              >
                <div>
                  <h3 className="font-mono-display text-[15px] leading-tight text-foreground">
                    {e.role}
                  </h3>
                  <div className="font-mono-display mt-0.5 text-[13px] text-foreground/70">
                    {e.org} · {e.type}
                  </div>
                  <div className="font-mono-label mt-1.5 text-[11px] uppercase tracking-[0.08em] text-[var(--meta)]">
                    {e.period} · {e.duration}
                  </div>
                  <div className="font-mono-label text-[11px] uppercase tracking-[0.08em] text-[var(--meta)]">
                    {e.location}
                  </div>
                </div>
                {e.note && (
                  <p className="font-mono-label text-[12px] leading-[1.65] text-foreground/70">
                    {e.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Recommendations — from LinkedIn */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7 }}
          className="mt-20 border-t border-[var(--rule)] pt-10"
        >
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="font-mono-display text-[clamp(1.25rem,2.5vw,1.6rem)] leading-tight text-foreground">
              Recommendations
            </h2>
            <span className="font-mono-label text-[11px] tabular-nums text-[var(--meta)]">
              {recommendations.length}
            </span>
          </div>
          <ul className="space-y-8">
            {recommendations.map((r) => (
              <li
                key={r.name}
                className="border-b border-[var(--rule)] pb-8"
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {/* Avatar — real photo, LinkedIn style */}
                    {r.photo ? (
                      <img
                        src={r.photo}
                        alt={r.name}
                        className="h-11 w-11 shrink-0 rounded-full object-cover border border-[var(--rule)]"
                        draggable={false}
                      />
                    ) : (
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold text-white"
                        style={{ backgroundColor: r.color }}
                      >
                        {r.initials}
                      </div>
                    )}
                    <div>
                      <h3 className="font-mono-display text-[15px] leading-tight text-foreground">
                        {r.name}
                      </h3>
                      <div className="font-mono-label mt-0.5 text-[11px] text-foreground/60">
                        {r.title}
                      </div>
                    </div>
                  </div>
                  <span className="font-mono-label shrink-0 text-[11px] uppercase tracking-[0.08em] text-[var(--meta)]">
                    {r.date}
                  </span>
                </div>
                <p className="font-mono-label text-[12px] leading-[1.7] text-foreground/75">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="font-mono-label mt-3 text-[10px] uppercase tracking-[0.08em] text-[var(--meta)]">
                  {r.relationship}
                </div>
              </li>
            ))}
          </ul>
        </motion.section>
      </div>
    </div>
  );
}
