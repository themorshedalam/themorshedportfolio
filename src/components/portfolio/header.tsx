"use client";

import { motion } from "framer-motion";
import { profile, navItems } from "@/lib/projects";

type Props = {
  activeNav: string;
  onNav: (id: string) => void;
  onHome: () => void;
  hasProject?: boolean;
};

export function Header({ activeNav, onNav, onHome, hasProject = true }: Props) {
  return (
    <header className="relative z-30 flex h-16 items-center justify-between border-b border-[var(--rule)] bg-[var(--cream)] px-6 md:px-10">
      {/* Brand — clicking returns to the homepage */}
      <button
        onClick={onHome}
        className="group flex items-baseline gap-2"
        data-cursor="link"
      >
        <span className="font-mono-label text-[12px] tracking-[0.02em] text-foreground">
          MA
        </span>
        <span className="font-mono-label text-[12px] tracking-[0.02em] text-foreground/45">
          — Studio
        </span>
      </button>

      {/* Center — animated GIF logo */}
      <img
        src="/header-logo.gif"
        alt="MA Studio"
        className="absolute left-1/2 top-1/2 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full md:block"
      />

      {/* Nav — no numbers */}
      <nav className="flex items-center gap-7 md:gap-9">
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
              className="group relative"
            >
              <span
                className={`font-mono-label text-[12px] tracking-[0.02em] transition-colors duration-300 ${
                  isActive ? "text-foreground" : "text-foreground/45 hover:text-foreground"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 h-px w-full bg-foreground"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
