"use client";

import { cn } from "@/lib/utils";
import type { ConnectionStatus } from "@/types/voice";

interface ConnectionStatusProps {
  status: ConnectionStatus;
  className?: string;
}

/**
 * Compact connection-status indicator. Uses an icon + label + color.
 */
export function ConnectionStatus({ status, className }: ConnectionStatusProps) {
  const { label, color, Icon } = config(status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-background/60 backdrop-blur",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={`Connection: ${label}`}
    >
      <span className={cn("h-2 w-2 rounded-full", color)} aria-hidden />
      <span>{label}</span>
    </span>
  );
}

function config(status: ConnectionStatus): {
  label: string;
  color: string;
  Icon?: React.ComponentType<{ className?: string }>;
} {
  switch (status) {
    case "connected":
      return { label: "Connected", color: "bg-emerald-500" };
    case "connecting":
      return { label: "Connecting…", color: "bg-amber-500 animate-pulse" };
    case "reconnecting":
      return { label: "Reconnecting…", color: "bg-amber-500 animate-pulse" };
    case "disconnected":
      return { label: "Disconnected", color: "bg-foreground/40" };
  }
}
