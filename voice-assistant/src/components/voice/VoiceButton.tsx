"use client";

import { Mic, MicOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VoiceState } from "@/types/voice";

interface VoiceButtonProps {
  state: VoiceState;
  /** Whether microphone access has been granted */
  micGranted: boolean | null;
  disabled?: boolean;
  onClick: () => void;
}

/**
 * Central voice control. Visually prominent — large circular button.
 *
 * State visualization is NOT color-only:
 *   - The icon changes (Mic / MicOff / Alert)
 *   - The label changes ("Tap to speak" / "Listening" / "Thinking" / "Speaking" / "Interrupted" / "Connection error")
 *   - The ring pulse pattern changes per state
 */
export function VoiceButton({
  state,
  micGranted,
  disabled,
  onClick,
}: VoiceButtonProps) {
  const isListening = state === "listening";
  const isThinking = state === "thinking";
  const isSpeaking = state === "speaking";
  const isInterrupted = state === "interrupted";
  const isError = state === "error" || micGranted === false;
  const isConnecting = state === "connecting" || state === "disconnected";

  // Aria label depends on the next action the click will trigger.
  const ariaLabel = (() => {
    if (isError) return "Retry voice connection";
    if (isConnecting) return "Connecting to voice session";
    if (isListening) return "Stop listening";
    if (isSpeaking) return "Interrupt the assistant";
    return "Start continuous conversation";
  })();

  const label = (() => {
    if (isError) return micGranted === false ? "Mic blocked" : "Connection error";
    if (isConnecting) return "Connecting…";
    if (isListening) return "Listening — tap to stop";
    if (isThinking) return "Thinking";
    if (isSpeaking) return "Speaking — tap to interrupt";
    if (isInterrupted) return "Interrupted";
    return "Tap to start";
  })();

  // Idle / Ready: solid ring, no pulse.
  // Listening: 3-dot pulse, fast.
  // Thinking: 3 dots, slow.
  // Speaking: waveform bars.
  // Interrupted: brief flash.
  // Error: alert icon.

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={onClick}
        // Allow clicking while speaking/thinking so the user can tap-to-interrupt.
        disabled={disabled || isConnecting}
        aria-label={ariaLabel}
        aria-pressed={isListening}
        title={
          isListening
            ? "Tap to stop the conversation"
            : isSpeaking
              ? "Tap to interrupt the assistant"
              : "Tap to start a continuous conversation"
        }
        className={cn(
          "relative h-24 w-24 sm:h-28 sm:w-28 rounded-full",
          "flex items-center justify-center",
          "transition-transform duration-200",
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "active:scale-95",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        {/* Outer ring */}
        <span
          className={cn(
            "absolute inset-0 rounded-full border-2 transition-colors",
            isError
              ? "border-destructive/60"
              : isListening
                ? "border-emerald-500/70"
                : isSpeaking
                  ? "border-sky-500/70"
                  : isInterrupted
                    ? "border-amber-500/70"
                    : "border-foreground/20",
          )}
          aria-hidden
        />

        {/* Pulse rings (only for listening / speaking) */}
        {isListening && (
          <>
            <span
              className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping"
              aria-hidden
            />
            <span
              className="absolute inset-2 rounded-full bg-emerald-500/10 animate-ping"
              style={{ animationDelay: "0.4s" }}
              aria-hidden
            />
          </>
        )}
        {isSpeaking && (
          <span
            className="absolute inset-0 rounded-full bg-sky-500/10 animate-pulse"
            aria-hidden
          />
        )}

        {/* Inner button face */}
        <span
          className={cn(
            "relative h-16 w-16 sm:h-20 sm:w-20 rounded-full",
            "flex items-center justify-center",
            "shadow-lg transition-colors",
            isError
              ? "bg-destructive text-destructive-foreground"
              : isListening
                ? "bg-emerald-600 text-white"
                : isSpeaking
                  ? "bg-sky-600 text-white"
                  : isInterrupted
                    ? "bg-amber-600 text-white"
                    : "bg-primary text-primary-foreground",
          )}
        >
          {isError ? (
            <AlertCircle className="h-7 w-7 sm:h-8 sm:w-8" />
          ) : isListening ? (
            <Mic className="h-7 w-7 sm:h-8 sm:w-8" />
          ) : micGranted === false ? (
            <MicOff className="h-7 w-7 sm:h-8 sm:w-8" />
          ) : isThinking ? (
            <ThinkingDots />
          ) : isSpeaking ? (
            <SpeakingWave />
          ) : (
            <Mic className="h-7 w-7 sm:h-8 sm:w-8" />
          )}
        </span>
      </button>

      {/* Label */}
      <div
        className="text-sm font-medium text-foreground/80 select-none"
        role="status"
        aria-live="polite"
      >
        {label}
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <span className="flex items-end gap-1" aria-hidden>
      <span
        className="h-2 w-2 rounded-full bg-current animate-bounce"
        style={{ animationDelay: "0ms", animationDuration: "0.9s" }}
      />
      <span
        className="h-2 w-2 rounded-full bg-current animate-bounce"
        style={{ animationDelay: "150ms", animationDuration: "0.9s" }}
      />
      <span
        className="h-2 w-2 rounded-full bg-current animate-bounce"
        style={{ animationDelay: "300ms", animationDuration: "0.9s" }}
      />
    </span>
  );
}

function SpeakingWave() {
  return (
    <span className="flex items-end gap-1 h-8" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="w-1.5 rounded-full bg-current animate-equalizer"
          style={{
            height: "100%",
            animationDelay: `${i * 90}ms`,
            animationDuration: "0.7s",
          }}
        />
      ))}
    </span>
  );
}
