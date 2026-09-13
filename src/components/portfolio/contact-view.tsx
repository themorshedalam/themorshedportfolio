"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/projects";

export function ContactView() {
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
          <span>/contact</span>
          <span className="text-[var(--rule)]">/</span>
          <span>Get in touch</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif-display text-balance text-[clamp(2.5rem,7vw,5rem)] leading-[1.02] text-foreground"
        >
          Let&apos;s make
          <br />
          something good.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-body-sans mt-8 max-w-[560px] text-balance text-[16px] leading-[1.6] text-foreground/75"
        >
          Always open to conversation about campaigns, launches, and seasonal
          films. If you have a brief — or even just a direction — I&apos;d love to
          hear what you&apos;re making.
        </motion.p>

        {/* Email + meta grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.7 }}
          className="mt-14 grid gap-8 border-t border-[var(--rule)] pt-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div>
            <div className="font-mono-label mb-2 text-[10px] uppercase tracking-[0.24em] text-[var(--meta)]">
              Email
            </div>
            <a
              href={`mailto:${profile.email}`}
              data-cursor="link"
              className="font-serif-display link-underline text-[18px] text-foreground"
            >
              {profile.email}
            </a>
          </div>
          <div>
            <div className="font-mono-label mb-2 text-[10px] uppercase tracking-[0.24em] text-[var(--meta)]">
              Location
            </div>
            <div className="font-serif-display text-[18px] text-foreground/85">
              {profile.location}
            </div>
            <div className="font-mono-label mt-1 text-[11px] text-[var(--meta)]">
              UAE · GMT+4
            </div>
          </div>
          <div>
            <div className="font-mono-label mb-2 text-[10px] uppercase tracking-[0.24em] text-[var(--meta)]">
              Social
            </div>
            <div className="flex flex-col gap-1.5">
              {profile.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  data-cursor="link"
                  className="font-serif-display link-underline text-[17px] text-foreground/85 hover:text-foreground"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Big CTA */}
        <motion.a
          href={`mailto:${profile.email}`}
          data-cursor="link"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="group mt-20 block border-t border-[var(--rule)] pt-10"
        >
          <div className="font-mono-label mb-2 text-[10px] uppercase tracking-[0.24em] text-[var(--meta)]">
            Start a project
          </div>
          <div className="flex items-center gap-4">
            <span className="font-serif-display text-balance text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.05] text-foreground transition-opacity group-hover:opacity-50">
              Write a hello →
            </span>
          </div>
        </motion.a>
      </div>
    </div>
  );
}
