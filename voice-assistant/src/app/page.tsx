"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Keyboard, Send, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { RealtimeSession } from "@/lib/realtime";
import { Header } from "@/components/voice/Conversation";
import { Transcript, type ToolEventView } from "@/components/voice/Transcript";
import { VoiceButton } from "@/components/voice/VoiceButton";
import { VoiceVisualizer } from "@/components/voice/VoiceVisualizer";
import type {
  ConversationMessage,
  RealtimeErrorCode,
  VoiceState,
  ConnectionStatus,
} from "@/types/voice";

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function Home() {
  // ---- Session ----
  const sessionRef = useRef<RealtimeSession | null>(null);
  if (sessionRef.current == null) {
    sessionRef.current = new RealtimeSession();
  }
  const session = sessionRef.current;

  // ---- UI state ----
  const [voiceState, setVoiceState] = useState<VoiceState>("disconnected");
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [streamingAssistant, setStreamingAssistant] = useState<{
    id: string;
    text: string;
  } | null>(null);
  const [toolEvents, setToolEvents] = useState<ToolEventView[]>([]);
  const [audioLevel, setAudioLevel] = useState<number | null>(null);
  const [mode, setMode] = useState<"voice" | "text">("voice");
  const [textInput, setTextInput] = useState("");
  const [micGranted, setMicGranted] = useState<boolean | null>(null);
  const [error, setError] = useState<{ code: RealtimeErrorCode; msg: string } | null>(
    null,
  );
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [voiceName, setVoiceName] = useState<string>("");
  const [modelName, setModelName] = useState<string>("");

  // ---- Wire session callbacks once ----
  useEffect(() => {
    session.on({
      onVoiceStateChange: (s) => setVoiceState(s),
      onConnectionStatusChange: (s) => setConnectionStatus(s),
      onSessionReady: (info) => {
        setVoiceName(info.voice ?? "");
        setModelName(info.model ?? "");
      },
      onTranscript: (m) => {
        // Drop the streaming placeholder if its final form arrives.
        setStreamingAssistant((cur) =>
          cur && cur.id === m.id ? null : cur,
        );
        setMessages((prev) => [...prev, m]);
      },
      onTranscriptUpdate: (id, text, final) => {
        if (final) {
          // The full message will arrive via onTranscript. For now, just
          // clear the streaming placeholder if it matches.
          setStreamingAssistant((cur) => (cur && cur.id === id ? null : cur));
        } else {
          setStreamingAssistant({ id, text });
        }
      },
      onAudioLevel: (l) => setAudioLevel(l),
      onToolCalled: (id, name, args) => {
        setToolEvents((prev) => [
          ...prev,
          { id, name, args, status: "called" },
        ]);
      },
      onToolResult: (id, name, ok, result, errMsg) => {
        setToolEvents((prev) =>
          prev.map((e) =>
            e.id === id
              ? {
                  ...e,
                  status: ok ? "ok" : "failed",
                  result,
                  error: errMsg,
                }
              : e,
          ),
        );
      },
      onError: (code, message) => {
        setError({ code, msg: message });
        // Auto-dismiss after a few seconds for non-fatal errors.
        setTimeout(() => setError((cur) => (cur?.code === code ? null : cur)), 5000);
      },
      onFatalError: (code, message) => {
        setFatalError(`${message} (code: ${code})`);
      },
    });

    // Auto-connect on mount. The session mints a short-lived token from
    // the backend and then opens the socket. The onSessionReady callback
    // receives the voice + model names for display — no separate fetch
    // is needed (the permanent API key never reaches the browser).
    session.connect();

    return () => {
      session.disconnect();
    };
  }, []);

  // ---- Combined messages: history + streaming placeholder ----
  const visibleMessages: ConversationMessage[] = streamingAssistant
    ? [
        ...messages,
        {
          id: streamingAssistant.id,
          role: "assistant",
          content: streamingAssistant.text || "",
          createdAt: new Date().toISOString(),
          streaming: true,
        },
      ]
    : messages;

  // ---- Handlers ----
  const handleVoiceButtonClick = useCallback(async () => {
    // Clear any prior error banner.
    setError(null);
    setFatalError(null);

    // CRITICAL: Unlock the playback AudioContext from this user gesture.
    // Browsers block AudioContext from producing sound until it has been
    // resumed by a user gesture (click, tap, keypress).
    session.ensurePlaybackUnlocked();

    if (voiceState === "error" || connectionStatus === "disconnected") {
      // Reconnect.
      await session.connect();
      return;
    }

    if (voiceState === "speaking" || voiceState === "thinking") {
      // Barge-in: interrupt the AI mid-response. After the interrupt,
      // the server transitions to "ready", and if continuous mode is on,
      // listening auto-restarts so the user can immediately speak again.
      session.interrupt();
      return;
    }

    if (voiceState === "listening") {
      // User tapped while listening → STOP the continuous conversation.
      // This is the "I'm done talking" button.
      session.setContinuousMode(false);
      session.stopListening();
      setMicGranted(true);
      return;
    }

    // voiceState === "ready" → START continuous conversation mode.
    // The user taps once, and the assistant will automatically re-listen
    // after each AI reply, so they can keep talking without tapping again.
    session.setContinuousMode(true);
    await session.startListening();
    if (session.getVoiceState() === "listening") {
      setMicGranted(true);
    } else if (session.getVoiceState() === "error") {
      setMicGranted(false);
      session.setContinuousMode(false);
    }
  }, [session, voiceState, connectionStatus]);

  const handleSendText = useCallback(() => {
    const text = textInput.trim();
    if (!text) return;
    if (connectionStatus !== "connected") {
      setError({
        code: "connection_failed",
        msg: "Cannot send — not connected.",
      });
      return;
    }
    setError(null);
    // Unlock playback AudioContext from this user gesture (button click /
    // Enter keypress) — same reason as in handleVoiceButtonClick.
    session.ensurePlaybackUnlocked();
    session.sendText(text);
    setTextInput("");
    setMode("voice");
  }, [session, textInput, connectionStatus]);

  const handleClear = useCallback(() => {
    setMessages([]);
    setToolEvents([]);
    setStreamingAssistant(null);
  }, []);

  const handleReconnect = useCallback(() => {
    session.disconnect();
    setError(null);
    setFatalError(null);
    setTimeout(() => session.connect(), 100);
  }, [session]);

  // ---- Keyboard shortcut: space toggles listening when in voice mode ----
  useEffect(() => {
    if (mode !== "voice") return;
    const handler = (e: KeyboardEvent) => {
      // Don't intercept when the user is typing in an input.
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (e.code === "Space") {
        e.preventDefault();
        handleVoiceButtonClick();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mode, handleVoiceButtonClick]);

  // ---- Render ----
  return (
    <div className="flex flex-col min-h-screen max-h-screen h-screen bg-background text-foreground">
      <Header
        voiceState={voiceState}
        connectionStatus={connectionStatus}
        voiceName={voiceName}
        modelName={modelName}
        onClear={handleClear}
        onReconnect={handleReconnect}
      />

      {/* Conversation area */}
      <main className="flex-1 min-h-0 flex flex-col">
        <Transcript
          messages={visibleMessages}
          toolEvents={toolEvents}
          className="transcript-scroll"
        />

        {/* Visualizer + voice button + status */}
        <div className="shrink-0 border-t border-border bg-background/95 backdrop-blur px-4 py-4 sm:px-6 sm:py-5">
          {/* Error banner */}
          {(error || fatalError) && (
            <div
              role="alert"
              className={cn(
                "mx-auto max-w-2xl mb-3 flex items-start gap-2 px-3 py-2 rounded-lg text-sm",
                fatalError
                  ? "bg-destructive/10 text-destructive border border-destructive/30"
                  : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30",
              )}
            >
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                {fatalError || error?.msg}
              </div>
              {!fatalError && (
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-foreground/60 hover:text-foreground shrink-0"
                  aria-label="Dismiss error"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          <div className="flex flex-col items-center gap-3">
            <VoiceVisualizer
              level={audioLevel}
              active={voiceState === "listening"}
            />
            <VoiceButton
              state={voiceState}
              micGranted={micGranted}
              onClick={handleVoiceButtonClick}
            />

            {/* Mode toggle */}
            <div className="flex items-center gap-2 mt-1">
              <Button
                variant={mode === "voice" ? "default" : "outline"}
                size="sm"
                onClick={() => setMode("voice")}
                aria-pressed={mode === "voice"}
                className="gap-1.5"
              >
                <Mic className="h-3.5 w-3.5" />
                Voice
              </Button>
              <Button
                variant={mode === "text" ? "default" : "outline"}
                size="sm"
                onClick={() => setMode("text")}
                aria-pressed={mode === "text"}
                className="gap-1.5"
              >
                <Keyboard className="h-3.5 w-3.5" />
                Text
              </Button>
            </div>

            {/* Text input — slides in when text mode is active */}
            {mode === "text" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendText();
                }}
                className="w-full max-w-2xl flex gap-2 mt-1"
              >
                <Input
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type a message…"
                  aria-label="Message"
                  autoFocus
                  disabled={connectionStatus !== "connected"}
                />
                <Button
                  type="submit"
                  size="icon"
                  aria-label="Send"
                  disabled={!textInput.trim() || connectionStatus !== "connected"}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            )}

            {/* Hint line */}
            <div className="text-[11px] text-foreground/50 text-center">
              {mode === "voice"
                ? voiceState === "listening"
                  ? "Continuous mode — just speak, I'm listening. Tap to stop."
                  : voiceState === "speaking"
                    ? "Tap to interrupt and speak."
                    : voiceState === "thinking"
                      ? "Thinking…"
                      : "Tap the mic to start. Keep talking — it auto-restarts after each reply."
                : "Press Enter to send. Switch to Voice to continue aloud."}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
