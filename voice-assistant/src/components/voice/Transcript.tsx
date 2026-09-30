"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { ConversationMessage } from "@/types/voice";
import { Wrench, CheckCircle2, XCircle } from "lucide-react";

interface TranscriptProps {
  messages: ConversationMessage[];
  /** Tool call entries surfaced alongside the transcript */
  toolEvents?: ToolEventView[];
  className?: string;
}

export interface ToolEventView {
  id: string;
  name: string;
  args?: unknown;
  status: "called" | "ok" | "failed";
  result?: unknown;
  error?: string;
}

/**
 * Live transcript — renders the running conversation as a vertical list.
 *
 * - User messages: right-aligned, muted background.
 * - Assistant messages: left-aligned, primary background.
 * - Tool calls: full-width, monospaced, with a status icon.
 * - Empty conversation: friendly placeholder.
 *
 * Auto-scrolls to the latest entry when new content arrives, unless the
 * user has manually scrolled up (we detect this via scroll position).
 */
export function Transcript({
  messages,
  toolEvents = [],
  className,
}: TranscriptProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const stickToBottomRef = useRef(true);

  // Detect manual scroll-up: if the user scrolls away from the bottom, we
  // stop auto-scrolling until they reach the bottom again.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const distFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight;
      stickToBottomRef.current = distFromBottom < 80;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-scroll on new messages / updates.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !stickToBottomRef.current) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, toolEvents]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        "flex-1 min-h-0 overflow-y-auto",
        "px-4 py-3 sm:px-6 sm:py-4",
        "flex flex-col gap-3",
        className,
      )}
      role="log"
      aria-live="polite"
      aria-relevant="additions text"
    >
      {messages.length === 0 && toolEvents.length === 0 && (
        <div className="m-auto text-center text-foreground/50 select-none">
          <p className="text-sm">How can I help you?</p>
          <p className="mt-1 text-xs">
            Tap the microphone below, or type a message.
          </p>
        </div>
      )}

      {messages.map((m) => (
        <MessageRow key={m.id} message={m} />
      ))}

      {toolEvents.length > 0 && (
        <div className="mt-2 space-y-2">
          {toolEvents.map((e) => (
            <ToolRow key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}

function MessageRow({ message }: { message: ConversationMessage }) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  if (isSystem) {
    // System messages are not shown in the transcript.
    return null;
  }
  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[85%] sm:max-w-[75%] px-3.5 py-2.5 rounded-2xl",
          "text-sm sm:text-base leading-relaxed",
          "whitespace-pre-wrap break-words",
          isUser
            ? "bg-muted text-foreground rounded-br-md"
            : "bg-primary text-primary-foreground rounded-bl-md",
          message.error && "ring-2 ring-destructive/60",
        )}
      >
        <div
          className={cn(
            "text-[10px] uppercase tracking-wider opacity-70 mb-1 font-semibold",
          )}
        >
          {isUser ? "You" : "AI"}
        </div>
        <div>
          {message.content}
          {message.streaming && (
            <span className="inline-block w-1.5 h-4 ml-1 align-text-bottom bg-current opacity-60 animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
}

function ToolRow({ event }: { event: ToolEventView }) {
  return (
    <div className="w-full">
      <div className="mx-auto max-w-[90%] sm:max-w-[80%] flex items-start gap-2 px-3 py-2 rounded-lg border border-foreground/15 bg-foreground/5 text-xs sm:text-sm">
        <Wrench className="h-3.5 w-3.5 mt-0.5 shrink-0 text-foreground/60" />
        <div className="flex-1 min-w-0">
          <div className="font-mono font-semibold text-foreground/80">
            {event.name}
            {event.status === "ok" && (
              <CheckCircle2 className="inline h-3.5 w-3.5 ml-1.5 text-emerald-600" />
            )}
            {event.status === "failed" && (
              <XCircle className="inline h-3.5 w-3.5 ml-1.5 text-destructive" />
            )}
          </div>
          {event.args !== undefined && (
            <pre className="mt-1 text-[11px] font-mono text-foreground/70 whitespace-pre-wrap break-words">
              {JSON.stringify(event.args)}
            </pre>
          )}
          {event.error && (
            <div className="mt-1 text-destructive text-[11px]">
              {event.error}
            </div>
          )}
          {event.result !== undefined && (
            <pre className="mt-1 text-[11px] font-mono text-foreground/70 whitespace-pre-wrap break-words">
              {JSON.stringify(event.result)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
