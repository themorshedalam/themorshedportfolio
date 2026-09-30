"use client";

import { cn } from "@/lib/utils";
import { Settings, Volume2, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectionStatus } from "./ConnectionStatus";
import { VoiceStatus } from "./VoiceStatus";
import type { ConnectionStatus as ConnStatus, VoiceState } from "@/types/voice";

interface HeaderProps {
  voiceState: VoiceState;
  connectionStatus: ConnStatus;
  voiceName: string;
  modelName: string;
  onClear: () => void;
  onReconnect: () => void;
  className?: string;
}

/**
 * Top-of-page header with the assistant name, voice/connection status chips,
 * and the small actions (clear conversation, reconnect, settings).
 */
export function Header({
  voiceState,
  connectionStatus,
  voiceName,
  modelName,
  onClear,
  onReconnect,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4",
        "border-b border-border bg-background/80 backdrop-blur",
        className,
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
          <Volume2 className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-sm sm:text-base font-semibold truncate">
            AI Assistant
          </div>
          <div className="text-[10px] text-foreground/60 truncate">
            Voice: <span className="font-mono">{voiceName || "—"}</span> · Model:{" "}
            <span className="font-mono">{modelName || "—"}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-end">
        <VoiceStatus state={voiceState} />
        <ConnectionStatus status={connectionStatus} />
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          aria-label="Clear conversation"
          title="Clear conversation"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReconnect}
          aria-label="Reconnect"
          title="Reconnect"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Settings (not implemented)"
          title="Settings"
          disabled
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
