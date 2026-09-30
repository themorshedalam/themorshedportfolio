"use client";

import { motion } from "framer-motion";
import { navItems } from "@/lib/projects";
import { QuranVerse } from "./quran-verse";
import { ThemeToggle } from "./theme-toggle";

type Props = {
  activeNav: string;
  onNav: (id: string) => void;
  onHome: () => void;
  hasProject?: boolean;
};

export function Header({ activeNav, onNav, onHome, hasProject = true }: Props) {
  return (
    <header className="relative z-30 border-b border-[var(--rule)] bg-[var(--cream)]">
      {/* ===== DESKTOP VIEW (md and up): Single elegant h-16 bar ===== */}
      <div className="hidden h-16 items-center justify-between px-6 md:flex md:px-10">
        {/* Brand — clicking returns to the homepage */}
        <button
          onClick={onHome}
          className="group flex items-baseline gap-2 shrink-0"
          data-cursor="link"
          aria-label="Morshed Alam — MA Studio"
        >
          <span className="text-[12px] font-medium tracking-[0.02em] text-foreground">
            MA
          </span>
          <span className="text-[12px] tracking-[0.02em] text-foreground/70">
            — Studio
          </span>
        </button>

        {/* Center — rotating Quran verse (desktop only) */}
        <QuranVerse />

        {/* Nav + theme toggle */}
        <div className="flex items-center gap-7 lg:gap-9">
          <nav className="flex items-center gap-7 lg:gap-9">
            {navItems.map((item) => {
              const isActive =
                item.id === "project"
                  ? activeNav === "project" && hasProject
                  : activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNav(item.id)}
                  data-cursor="link"
                  className="group relative py-1"
                >
                  <span
                    className={`text-[12px] tracking-[0.04em] transition-colors duration-200 ${
                      isActive ? "text-foreground font-medium" : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline-desktop"
                      className="absolute -bottom-0.5 left-0 h-px w-full bg-foreground"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>

      {/* ===== MOBILE VIEW (under md): Dedicated 2-row layout with zero overlap ===== */}
      <div className="flex flex-col md:hidden">
        {/* Row 1: Brand & Theme Toggle */}
        <div className="flex h-12 items-center justify-between border-b border-[var(--rule)]/60 px-4 sm:px-6">
          <button
            onClick={onHome}
            className="flex items-baseline gap-1.5"
            data-cursor="link"
            aria-label="Morshed Alam — MA Studio"
          >
            <span className="text-[12px] font-semibold tracking-[0.04em] text-foreground">
              MA
            </span>
            <span className="text-[12px] tracking-[0.04em] text-foreground/70">
              — Studio
            </span>
          </button>

          <ThemeToggle />
        </div>

        {/* Row 2: 4 evenly spaced navigation tabs with active indicator */}
        <nav className="flex h-10 items-center justify-around px-2 bg-[var(--cream)]">
          {navItems.map((item) => {
            const isActive =
              item.id === "project"
                ? activeNav === "project" && hasProject
                : activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNav(item.id)}
                data-cursor="link"
                className="relative flex flex-1 h-full items-center justify-center py-2"
              >
                <span
                  className={`text-[11px] uppercase tracking-[0.16em] transition-colors duration-200 ${
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-foreground/50 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="nav-underline-mobile"
                    className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-foreground"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
