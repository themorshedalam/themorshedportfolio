"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface VoiceVisualizerProps {
  /** 0..1 audio level (RMS). `null` = idle. */
  level: number | null;
  /** Whether we're capturing mic input (drives the idle vs. active look) */
  active: boolean;
  bars?: number;
  className?: string;
}

/**
 * Realtime audio visualizer. Renders a row of vertical bars whose heights
 * follow the incoming `level` value with smoothing.
 *
 * When idle, the bars show a flat line.
 */
export function VoiceVisualizer({
  level,
  active,
  bars = 24,
  className,
}: VoiceVisualizerProps) {
  // Smoothed levels, one per bar.
  const levelsRef = useRef<Float32Array>(new Float32Array(bars));
  const rafRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const tick = () => {
      const levels = levelsRef.current;
      const target = level ?? 0;
      // Shift left, push new value at the end.
      for (let i = 0; i < levels.length - 1; i++) {
        levels[i] = levels[i + 1] * 0.85;
      }
      // Apply some randomness so the bars look organic.
      const jitter = (Math.random() - 0.5) * 0.15;
      levels[levels.length - 1] = Math.max(0, Math.min(1, target + jitter));

      // Apply to DOM.
      const container = containerRef.current;
      if (container) {
        const children = container.children;
        for (let i = 0; i < children.length; i++) {
          const h = Math.max(2, levels[i] * 28);
          (children[i] as HTMLElement).style.height = `${h}px`;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [level, bars]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex items-center justify-center gap-1 h-8",
        !active && "opacity-40",
        className,
      )}
      aria-hidden
    >
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "w-1 rounded-full transition-colors",
            active ? "bg-emerald-500" : "bg-foreground/30",
          )}
          style={{ height: "2px" }}
        />
      ))}
    </div>
  );
}
