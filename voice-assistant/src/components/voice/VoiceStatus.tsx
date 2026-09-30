"use client";

import { cn } from "@/lib/utils";
import type { VoiceState } from "@/types/voice";

interface VoiceStatusProps {
  state: VoiceState;
  className?: string;
}

/**
 * Compact voice-state chip. Uses an icon + label + color so state is
 * comprehensible without relying on color alone (PRD §17, §34).
 */
export function VoiceStatus({ state, className }: VoiceStatusProps) {
  const { label, dot, Icon } = config(state);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        "bg-background/60 backdrop-blur",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={`Voice state: ${label}`}
    >
      <span className={cn("h-2 w-2 rounded-full", dot)} aria-hidden />
      <Icon className="h-3.5 w-3.5" aria-hidden />
      <span>{label}</span>
    </span>
  );
}

function config(state: VoiceState): {
  label: string;
  dot: string;
  Icon: React.ComponentType<{ className?: string }>;
} {
  switch (state) {
    case "disconnected":
      return { label: "Disconnected", dot: "bg-foreground/40", Icon: CircleIcon };
    case "connecting":
      return { label: "Connecting…", dot: "bg-amber-500 animate-pulse", Icon: SpinnerIcon };
    case "ready":
      return { label: "Ready", dot: "bg-emerald-500", Icon: CheckIcon };
    case "listening":
      return { label: "Listening", dot: "bg-emerald-500 animate-pulse", Icon: MicIcon };
    case "thinking":
      return { label: "Thinking", dot: "bg-violet-500 animate-pulse", Icon: DotsIcon };
    case "speaking":
      return { label: "Speaking", dot: "bg-sky-500 animate-pulse", Icon: WaveIcon };
    case "interrupted":
      return { label: "Interrupted", dot: "bg-amber-500", Icon: StopIcon };
    case "error":
      return { label: "Error", dot: "bg-destructive", Icon: AlertIcon };
  }
}

// Minimal inline icons (so this component stays self-contained and doesn't
// pull lucide-react icons we don't need elsewhere).
function CircleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}
function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${className ?? ""} animate-spin`}
      strokeLinecap="round"
    >
      <path d="M12 2a10 10 0 1 0 10 10" />
    </svg>
  );
}
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3" />
    </svg>
  );
}
function DotsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}
function WaveIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
    >
      <path d="M2 12h2M6 8v8M10 4v16M14 8v8M18 6v12M22 12h-2" />
    </svg>
  );
}
function StopIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}
function AlertIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2 1 22h22L12 2z" />
      <line x1="12" y1="9" x2="12" y2="14" />
      <line x1="12" y1="17" x2="12" y2="17.5" />
    </svg>
  );
}
