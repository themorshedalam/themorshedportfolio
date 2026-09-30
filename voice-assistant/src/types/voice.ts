/**
 * Shared types for the Real-Time Natural Voice AI Assistant.
 *
 * These types are used by both the frontend (React) and the backend
 * (Next.js API routes + socket.io mini-service) so that the realtime
 * session contract is defined in exactly one place.
 *
 * IMPORTANT: This file MUST stay client-safe. Do not import any Node-only
 * or server-only modules from here.
 */

// ---------------------------------------------------------------------------
// Voice state machine
// ---------------------------------------------------------------------------

/**
 * The full set of voice states the assistant can be in.
 *
 * State transitions are not linear — `speaking` can transition back to
 * `listening` (barge-in), `connecting` can fall back to `error`, etc.
 *
 * See the PRD "VOICE STATE MACHINE" section for the canonical diagram.
 */
export type VoiceState =
  | "disconnected" // No active session, no socket connection
  | "connecting" // Socket connecting or session being created
  | "ready" // Connected, microphone not yet enabled
  | "listening" // Microphone on, capturing user speech
  | "thinking" // User turn complete, waiting for AI response
  | "speaking" // AI audio is streaming to the speaker
  | "interrupted" // Barge-in detected, cancelling current AI response
  | "error"; // Unrecoverable error state (user must retry)

// ---------------------------------------------------------------------------
// Conversation / transcript
// ---------------------------------------------------------------------------

export type ConversationRole = "user" | "assistant" | "system";

export interface ConversationMessage {
  id: string;
  role: ConversationRole;
  content: string;
  /** ISO timestamp */
  createdAt: string;
  /** Set when this message was produced by a tool call */
  toolName?: string;
  /** Streaming flag — true until the message is fully received */
  streaming?: boolean;
  /** Error flag — set when an AI turn failed */
  error?: boolean;
}

// ---------------------------------------------------------------------------
// Connection status (separate from voice state — a session can be connected
// while idle, etc.)
// ---------------------------------------------------------------------------

export type ConnectionStatus =
  | "connected"
  | "connecting"
  | "reconnecting"
  | "disconnected";

// ---------------------------------------------------------------------------
// Audio transport — events exchanged between the client RealtimeSession
// and the backend voice-session mini-service via socket.io.
// ---------------------------------------------------------------------------

/**
 * Client → Server events.
 *
 * The client emits these to drive the realtime session. Audio is sent as
 * base64-encoded 16-bit PCM frames captured from the microphone.
 */
export interface ClientToServerEvents {
  /** Authenticate / announce a new session */
  "session:start": (payload: { sessionId: string; token: string }) => void;
  /** Tear down the session */
  "session:end": () => void;
  /** A 16-bit PCM audio chunk from the mic (base64) */
  "audio:chunk": (payload: { chunk: string; sampleRate: number }) => void;
  /** The user has finished speaking (VAD detected end-of-speech) */
  "speech:end": (payload: { sampleRate: number }) => void;
  /** The user started speaking while AI was speaking (barge-in) */
  "speech:interrupt": () => void;
  /** A typed text message (text mode shares the same conversation context) */
  "text:message": (payload: { text: string }) => void;
  /** Cancel any in-flight AI response without providing a new turn */
  "response:cancel": () => void;
}

/**
 * Server → Client events.
 *
 * Transcript events and audio events are emitted independently — the client
 * MUST NOT assume they arrive at the same time or in any particular order
 * relative to each other.
 */
export interface ServerToClientEvents {
  /** Session is ready (authenticated, server-side state initialized) */
  "session:ready": (payload: { sessionId: string }) => void;
  /** Session has ended (server-initiated or acknowledged client end) */
  "session:ended": () => void;
  /** A user transcript chunk arrived (could be partial or final) */
  "transcript:user": (payload: {
    id: string;
    text: string;
    final: boolean;
  }) => void;
  /** An assistant transcript chunk arrived (streaming) */
  "transcript:assistant": (payload: {
    id: string;
    text: string;
    final: boolean;
  }) => void;
  /** A PCM audio chunk for the current assistant turn (base64) */
  "audio:chunk": (payload: {
    id: string;
    chunk: string;
    sampleRate: number;
    /**
     * Format of the chunk's payload.
     * - `"pcm"` (default for backwards compat): raw 16-bit little-endian
     *   PCM mono at `sampleRate`.
     * - `"wav"`: a complete WAV file (with header). The client should use
     *   `AudioContext.decodeAudioData()` to decode it — this is more
     *   robust than manual header stripping and handles any sample rate.
     */
    format?: "pcm" | "wav";
  }) => void;
  /** The current assistant turn's audio stream is complete */
  "audio:end": (payload: { id: string }) => void;
  /** Voice state has changed on the server side */
  "voice:state": (payload: { state: VoiceState }) => void;
  /** A tool was called — surfaced in the UI for transparency */
  "tool:called": (payload: {
    id: string;
    name: string;
    args: unknown;
  }) => void;
  /** A tool returned a result */
  "tool:result": (payload: {
    id: string;
    name: string;
    ok: boolean;
    result?: unknown;
    error?: string;
  }) => void;
  /** Recoverable error (e.g. one bad ASR call) */
  "error": (payload: { code: string; message: string }) => void;
  /** Fatal error — session should be considered broken */
  "error:fatal": (payload: { code: string; message: string }) => void;
}

// ---------------------------------------------------------------------------
// Session bootstrap API (REST endpoint)
// ---------------------------------------------------------------------------

/**
 * Response from `POST /api/realtime/session`.
 *
 * The client uses these fields to connect its socket to the voice-session
 * mini-service. The permanent API key never leaves the server — only this
 * short-lived token is sent to the browser.
 */
export interface SessionBootstrapResponse {
  sessionId: string;
  /** Short-lived token, validated by the voice-session mini-service */
  token: string;
  /** ISO expiry timestamp */
  expiresAt: string;
  /** Voice identifier (e.g. "jam" or "xiaochen") — purely informational */
  voice: string;
  /** Configured model name — purely informational */
  model: string;
}

// ---------------------------------------------------------------------------
// Error codes (stable strings — used by observability + UI copy)
// ---------------------------------------------------------------------------

export type RealtimeErrorCode =
  | "microphone_denied"
  | "microphone_unavailable"
  | "microphone_disconnected"
  | "connection_failed"
  | "authentication_failed"
  | "network_failure"
  | "session_expired"
  | "rate_limited"
  | "service_unavailable"
  | "tool_failed"
  | "tool_timeout"
  | "invalid_tool_arguments"
  | "asr_failed"
  | "tts_failed"
  | "llm_failed"
  | "unexpected_event";

// ---------------------------------------------------------------------------
// Web Speech API type declarations
//
// These are the minimal types needed for the browser's built-in
// SpeechRecognition API. They are NOT in the default TypeScript DOM lib,
// so we declare them here.
//
// Browser support:
//   - Chrome / Edge: ✅ (prefixed as webkitSpeechRecognition)
//   - Safari: ✅ (prefixed as webkitSpeechRecognition)
//   - Firefox: ❌ (must fall back to server-side ASR)
// ---------------------------------------------------------------------------

/** A single speech recognition result (one alternative). */
interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

/** A single result, which may be final or interim. */
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

/** A list of recognition results from a single onresult event. */
interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

/** Event fired during speech recognition. */
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

/** Error event fired when speech recognition fails. */
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

/** The main SpeechRecognition interface. */
interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;

  start(): void;
  stop(): void;
  abort(): void;

  onstart: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => unknown)
    | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => unknown)
    | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onnomatch: ((this: SpeechRecognition, ev: Event) => unknown) | null;
}

/** Constructor for SpeechRecognition. */
declare const SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

// Also expose the webkit-prefixed variants on the Window interface.
declare global {
  interface Window {
    SpeechRecognition?: { prototype: SpeechRecognition; new (): SpeechRecognition };
    webkitSpeechRecognition?: {
      prototype: SpeechRecognition;
      new (): SpeechRecognition;
    };
  }
}
