/**
 * Client-side runtime configuration for the voice assistant.
 *
 * The values exposed here are intentionally safe to ship to the browser —
 * they contain NO API keys, NO secrets, NO credentials.
 *
 * Voice + model identifiers are read from server-side env vars at
 * `/api/realtime/session` and returned to the client as part of the session
 * bootstrap response, so the frontend never needs to know which voice or
 * model is currently configured.
 */

/**
 * Port of the voice-session socket.io mini-service.
 *
 * The gateway (Caddy) routes traffic based on the `XTransformPort` query
 * parameter. The frontend must always connect with:
 *
 *   io('/?XTransformPort=<port>')
 *
 * and never with a direct `http://localhost:<port>` URL.
 */
export const VOICE_SESSION_PORT = 3003;

/**
 * Sample rate used for streaming PCM audio between the client and the
 * voice-session mini-service. Both ends must agree on this value.
 *
 * 24000 Hz matches the TTS service output, so no resampling is needed
 * for the playback path.
 */
export const AUDIO_SAMPLE_RATE = 24000;

/**
 * VAD (Voice Activity Detection) tuning parameters.
 *
 * These run entirely on the client using Web Audio API AnalyserNode data.
 *
 * Tuning rationale:
 *   - The thresholds are deliberately HIGH so that background noise
 *     (fans, keyboard, A/C) does NOT trip false end-of-speech. The mic's
 *     noiseSuppression + echoCancellation (requested in getUserMedia)
 *     helps here too.
 *   - silenceDurationMs is long enough that natural mid-sentence pauses
 *     ("uhm", breathing) don't end the turn prematurely, but short enough
 *     that the assistant feels responsive.
 *   - minSpeechDurationMs filters out transient clicks and coughs.
 *
 * If the assistant still feels unresponsive or misfires, adjust these:
 *   - Too many false "end-of-speech" → raise silenceThreshold or
 *     silenceDurationMs.
 *   - Assistant never triggers → lower speechThreshold.
 */
export const VAD_CONFIG = {
  /** RMS volume above which speech is considered to have started */
  speechThreshold: 0.025,
  /** RMS volume below which speech is considered to have ended */
  silenceThreshold: 0.015,
  /** How long (ms) of continuous silence triggers end-of-speech */
  silenceDurationMs: 1100,
  /** Minimum speech duration (ms) before a turn is taken seriously */
  minSpeechDurationMs: 400,
  /** AnalyserNode FFT size — controls frequency resolution */
  fftSize: 1024,
  /** AnalyserNode smoothing time constant */
  smoothingTimeConstant: 0.7,
} as const;

/**
 * Audio playback queue tuning.
 */
export const PLAYBACK_CONFIG = {
  /** Initial latency (seconds) before the first audio chunk plays */
  initialBufferSeconds: 0.08,
  /** Max latency (seconds) — if exceeded, we drop older chunks to catch up */
  maxBufferSeconds: 1.5,
} as const;

/**
 * Microphone capture throttling.
 *
 * We do NOT stream every PCM frame to the backend — that would flood the
 * socket and the ASR API. Instead:
 *
 *   1. While the user is silent, we drop frames (don't send anything).
 *   2. Once VAD detects speech, we start buffering in-memory AND streaming
 *      to the backend at a throttled rate.
 *   3. When VAD detects end-of-speech, we flush any remaining buffered
 *      audio and signal `speech:end`.
 *
 * This keeps socket traffic proportional to actual speech, not to wall-clock
 * time. The ASR API only gets called once per actual user turn.
 */
export const MIC_CAPTURE_CONFIG = {
  /** ScriptProcessor buffer size (samples per onaudioprocess call). */
  bufferSize: 8192,
  /**
   * Minimum RMS required to consider a frame as "speech" for buffering
   * purposes. Slightly below VAD_CONFIG.speechThreshold so we don't miss
   * the very first syllable.
   */
  bufferThreshold: 0.018,
  /**
   * Drop frames whose RMS is below this even when in "listening" mode,
   * to avoid sending pure silence to the backend.
   */
  silenceDropThreshold: 0.005,
} as const;

/**
 * Socket.io reconnection settings. Bounded so we never enter an
 * infinite reconnect loop — after `reconnectionAttempts` the session
 * transitions to the `error` state and the user must retry manually.
 */
export const SOCKET_CONFIG = {
  transports: ["websocket", "polling"],
  forceNew: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 15000,
} as const;

/**
 * Default system prompt used by the voice-session mini-service.
 * The server overrides this if `REALTIME_SYSTEM_PROMPT` is set.
 */
export const DEFAULT_SYSTEM_PROMPT = `You are a natural, friendly male voice AI assistant.

Speak in a warm, professional, conversational tone — like you are talking with a colleague in the same room.
Keep responses concise and natural for spoken conversation. Avoid long monologues.
If you don't know something, say so — never invent information.
When the user changes topic mid-conversation, follow them naturally.
When interrupted, stop and listen, then continue the new turn.`;
