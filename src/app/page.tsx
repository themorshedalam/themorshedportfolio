"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUp, ArrowDown } from "lucide-react";
import { CustomCursor } from "@/components/portfolio/custom-cursor";
import { Header } from "@/components/portfolio/header";
import { Sidebar } from "@/components/portfolio/sidebar";
import { ProjectView } from "@/components/portfolio/project-view";
import { AboutView } from "@/components/portfolio/about-view";
import { ContactView } from "@/components/portfolio/contact-view";
import { IntroOverlay } from "@/components/portfolio/intro-overlay";
import { QuotesPanel } from "@/components/portfolio/quotes-panel";
import { projects, type NavId } from "@/lib/projects";

export default function Home() {
  const [activeNav, setActiveNav] = useState<NavId>("project");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const activeProject = activeProjectId
    ? projects.find((p) => p.id === activeProjectId) ?? null
    : null;

  const handleNav = useCallback((id: string) => {
    setActiveNav(id as NavId);
    setShowIntro(false);
    setMobileNav(false);
    // Clicking "Project" in the nav shows the first project directly
    if (id === "project") {
      setActiveProjectId(projects[0].id);
    }
  }, []);

  const handleSelectProject = useCallback((id: string) => {
    setActiveProjectId(id);
    setActiveNav("project");
    setShowIntro(false);
    setMobileNav(false);
  }, []);

  // Logo / "go home" — replay the intro
  const handleHome = useCallback(() => {
    setActiveNav("project");
    setActiveProjectId(null);
    setShowIntro(true);
    setMobileNav(false);
  }, []);

  // Intro completes → fade out to reveal the app
  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  // Block right-click, screenshots, and developer shortcuts globally
  useEffect(() => {
    if (showIntro) return;

    const onContextMenu = (e: MouseEvent) => e.preventDefault();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen" || e.code === "PrintScreen") {
        e.preventDefault();
        navigator.clipboard?.writeText("");
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); return false; }
      if ((e.ctrlKey || e.metaKey) && e.key === "p") { e.preventDefault(); return false; }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "S") { e.preventDefault(); return false; }
      if (e.key === "F12") { e.preventDefault(); return false; }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) { e.preventDefault(); return false; }
      if ((e.ctrlKey || e.metaKey) && e.key === "u") { e.preventDefault(); return false; }
    };

    const onCopy = (e: ClipboardEvent) => {
      if (!(e.target instanceof HTMLElement)) return;
      if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("copy", onCopy);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("copy", onCopy);
    };
  }, [showIntro]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showIntro) return;
      if (activeNav !== "project") return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        const cur = activeProjectId ?? "";
        const idx = projects.findIndex((p) => p.id === cur);
        const next = projects[(idx + 1) % projects.length];
        setActiveProjectId(next.id);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        const cur = activeProjectId ?? "";
        const idx = projects.findIndex((p) => p.id === cur);
        const prev = projects[(idx - 1 + projects.length) % projects.length];
        setActiveProjectId(prev.id);
      } else if (e.key === "Escape" && activeProjectId) {
        setActiveProjectId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeNav, activeProjectId, showIntro]);

  // Listen for "next project" custom event
  useEffect(() => {
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent).detail as string;
      handleSelectProject(id);
    };
    window.addEventListener("select-project", onSelect as EventListener);
    return () =>
      window.removeEventListener("select-project", onSelect as EventListener);
  }, [handleSelectProject]);

  return (
    <div className="app-shell relative flex h-screen flex-col overflow-hidden bg-[var(--cream)] text-foreground">
      <CustomCursor />

      <Header activeNav={activeNav} onNav={handleNav} onHome={handleHome} hasProject={!!activeProjectId} />

      {/* Mobile menu button */}
      <button
        onClick={() => setMobileNav(true)}
        data-cursor="link"
        className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-foreground bg-foreground text-[var(--cream)] shadow-lg lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex min-h-0 flex-1">
        {/* LEFT — projects sidebar (only on Project tab) */}
        {activeNav === "project" && (
          <div className="hidden w-[300px] shrink-0 lg:block xl:w-[340px]">
            <Sidebar
              activeId={activeProjectId}
              onSelect={handleSelectProject}
            />
          </div>
        )}

        {/* RIGHT — swaps between Quotes / ProjectView / About / Contact */}
        <main className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeNav}-${activeProjectId ?? "quotes"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              {activeNav === "project" && !activeProject && (
                <QuotesPanel active={!showIntro} />
              )}
              {activeNav === "project" && activeProject && (
                <ProjectView
                  project={activeProject}
                  transitionKey={activeProject.id}
                />
              )}
              {activeNav === "personal" && <AboutView />}
              {activeNav === "contact" && <ContactView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile drawer sidebar */}
      <AnimatePresence>
        {mobileNav && (
          <MobileDrawer
            activeId={activeProjectId}
            onSelect={handleSelectProject}
            onClose={() => setMobileNav(false)}
          />
        )}
      </AnimatePresence>

      <KeyboardHint start={!showIntro} />

      {/* Intro overlay — 1s MA-Studio logo, fade out */}
      <AnimatePresence>
        {showIntro && <IntroOverlay onComplete={handleIntroComplete} />}
      </AnimatePresence>
    </div>
  );
}

function MobileDrawer({
  activeId,
  onSelect,
  onClose,
}: {
  activeId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 lg:hidden"
    >
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        className="absolute left-0 top-0 h-full w-[85%] max-w-[360px] bg-[var(--sidebar)]"
      >
        <div className="flex items-center justify-between border-b border-[var(--rule)] px-6 py-4">
          <span className="font-mono-label text-[11px] uppercase tracking-[0.24em] text-foreground">
            Projects
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-foreground/60 hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="h-[calc(100%-57px)]">
          <Sidebar activeId={activeId} onSelect={onSelect} />
        </div>
      </motion.div>
    </motion.div>
  );
}

function KeyboardHint({ start }: { start: boolean }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!start) return;
    const t = setTimeout(() => setShow(true), 1200);
    const t2 = setTimeout(() => setShow(false), 4500);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [start]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.5 }}
          className="font-mono-label pointer-events-none fixed bottom-5 left-5 z-30 hidden items-center gap-2 rounded-full border border-[var(--rule)] bg-[var(--cream)]/95 px-3.5 py-2 text-[10px] uppercase tracking-[0.24em] text-[var(--meta)] backdrop-blur lg:flex"
        >
          <span>Use</span>
          <kbd className="flex h-5 w-5 items-center justify-center rounded border border-[var(--rule)] bg-[var(--cream-soft)] text-foreground">
            <ArrowUp className="h-3 w-3" />
          </kbd>
          <kbd className="flex h-5 w-5 items-center justify-center rounded border border-[var(--rule)] bg-[var(--cream-soft)] text-foreground">
            <ArrowDown className="h-3 w-3" />
          </kbd>
          <span>to cycle</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
