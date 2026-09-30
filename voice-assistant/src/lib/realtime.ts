"use client";

import { io, type Socket } from "socket.io-client";
import {
  AUDIO_SAMPLE_RATE,
  MIC_CAPTURE_CONFIG,
  PLAYBACK_CONFIG,
  SOCKET_CONFIG,
  VAD_CONFIG,
  VOICE_SESSION_PORT,
} from "@/lib/config";
import type {
  ClientToServerEvents,
  ConnectionStatus,
  ConversationMessage,
  RealtimeErrorCode,
  ServerToClientEvents,
  SessionBootstrapResponse,
  VoiceState,
} from "@/types/voice";

// ---------------------------------------------------------------------------
// Callbacks the host UI subscribes to
// ---------------------------------------------------------------------------

export interface RealtimeSessionCallbacks {
  onVoiceStateChange?: (state: VoiceState) => void;
  onConnectionStatusChange?: (status: ConnectionStatus) => void;
  onSessionReady?: (info: SessionBootstrapResponse) => void;
  onTranscript?: (message: ConversationMessage) => void;
  onTranscriptUpdate?: (id: string, text: string, final: boolean) => void;
  onAudioLevel?: (level: number) => void;
  onToolCalled?: (id: string, name: string, args: unknown) => void;
  onToolResult?: (
    id: string,
    name: string,
    ok: boolean,
    result?: unknown,
    error?: string,
  ) => void;
  onError?: (code: RealtimeErrorCode, message: string) => void;
  onFatalError?: (code: RealtimeErrorCode, message: string) => void;
}

interface ActivePlaybackTurn {
  id: string;
  /** Decoded Float32Array chunks queued for playback in arrival order */
  chunks: Float32Array[];
  /** Total samples accumulated so far */
  totalSamples: number;
  /** True once `audio:end` arrives */
  ended: boolean;
  /** True once playback has started */
  started: boolean;
  /** True if the turn was cancelled by barge-in */
  cancelled: boolean;
  /**
   * References to active AudioBufferSourceNode instances.
   *
   * CRITICAL: Web Audio API will GC a BufferSourceNode if no JS reference
   * holds it, EVEN AFTER `src.start()` is called. The audio will silently
   * never play. We hold references here until the turn ends or is cancelled.
   */
  sources: AudioBufferSourceNode[];
  /**
   * Number of in-flight `decodeAudioData` calls for this turn.
   *
   * When `audio:end` arrives, we MUST NOT remove the turn from
   * `activeTurns` if there are still pending decodes — otherwise the
   * decoded chunks will be added to a turn that no longer exists, and
   * `schedulePlayback` will find `0/0 chunks available` and the audio
   * will silently never play.
   */
  pendingDecodes: number;
}

// ---------------------------------------------------------------------------
// RealtimeSession
//
// This class is the entire frontend half of the "REALTIME SESSION"
// abstraction (PRD §9). The host page only needs to:
//
//   const session = new RealtimeSession();
//   session.on({...callbacks...});
//   await session.connect();
//   await session.startListening();  // mic on, VAD running
//   session.stopListening();         // mic off
//   session.interrupt();             // barge-in
//   session.disconnect();
// ---------------------------------------------------------------------------

export class RealtimeSession {
  private callbacks: RealtimeSessionCallbacks = {};
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null =
    null;
  private sessionInfo: SessionBootstrapResponse | null = null;

  // Microphone capture
  private micStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private vadRafId: number | null = null;
  private vadState: "idle" | "speaking" | "silence-after-speech" = "idle";
  private speechStartTs = 0;
  private silenceStartTs = 0;
  private isListening = false;
  /**
   * Mirror of vadState used by the audio capture path. Updated by tickVad()
   * so that onaudioprocess knows whether to send the current frame to the
   * backend (only send during active speech).
   */
  private currentlySpeaking = false;
  /**
   * Count of audio chunks sent during the current speaking session.
   * Reset to 0 when listening starts. Used for diagnostic logging — the
   * first chunk of each session logs its RMS/peak so we can verify the
   * mic is actually picking up audio.
   */
  private chunksSentThisTurn = 0;
  /**
   * The Web Speech API recognition instance (if supported by the browser).
   * When this is non-null, we use browser-native speech recognition instead
   * of sending audio to the server for z-ai ASR.
   */
  private speechRecognition: SpeechRecognition | null = null;
  /**
   * Monotonic ID used to tag interim transcript messages so the UI can
   * update them as the user speaks.
   */
  private currentTurnId = 0;
  /**
   * Continuous conversation mode.
   *
   * When true, the session automatically re-starts listening after the AI
   * finishes responding (voice:state transitions to "ready"). This lets the
   * user speak back and forth without tapping the mic button each time.
   *
   * Flow:
   *   1. User taps mic → setContinuousMode(true) + startListening()
   *   2. User speaks → recognition ends → transcript sent → state = thinking
   *   3. AI responds → TTS plays → state = ready
   *   4. handleServerVoiceState sees "ready" + continuousMode → auto-restarts listening
   *   5. User speaks again → repeat
   *   6. User taps mic while listening → setContinuousMode(false) + stopListening()
   */
  private continuousMode = false;

  // PCM playback
  private playbackContext: AudioContext | null = null;
  private activeTurns = new Map<string, ActivePlaybackTurn>();
  private playbackStartTime = 0;
  private nextPlaybackOffset = 0; // in samples, relative to playbackStartTime

  // State
  private voiceState: VoiceState = "disconnected";
  private connectionStatus: ConnectionStatus = "disconnected";
  private reconnectAttempts = 0;

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------

  on(callbacks: RealtimeSessionCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  getVoiceState(): VoiceState {
    return this.voiceState;
  }

  getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  /** Returns the session bootstrap info (voice, model, sessionId, …) once connected. */
  getSessionInfo(): SessionBootstrapResponse | null {
    return this.sessionInfo;
  }

  /**
   * Enable or disable continuous conversation mode.
   *
   * When enabled, the session automatically re-starts listening after the
   * AI finishes responding. The user taps once to start, and can continue
   * speaking back and forth without tapping again.
   *
   * Tap the mic button while listening to stop continuous mode entirely.
   */
  setContinuousMode(enabled: boolean): void {
    this.continuousMode = enabled;
    console.log(`[realtime] continuous mode ${enabled ? "ON" : "OFF"}`);
  }

  /** Returns true if continuous conversation mode is active. */
  isContinuousMode(): boolean {
    return this.continuousMode;
  }

  /**
   * Mint a session token from the backend, then open the socket.
   * The permanent API key is NEVER in the browser — only this short-lived
   * token is.
   */
  async connect(): Promise<void> {
    if (this.socket?.connected) return;
    this.setConnectionStatus("connecting");
    this.setVoiceState("connecting");

    try {
      const resp = await fetch("/api/realtime/session", {
        method: "POST",
        cache: "no-store",
      });
      if (!resp.ok) {
        throw new Error(`Failed to mint session: ${resp.status}`);
      }
      this.sessionInfo = (await resp.json()) as SessionBootstrapResponse;
    } catch (err) {
      this.emitFatal(
        "connection_failed",
        `Could not start a session: ${err instanceof Error ? err.message : String(err)}`,
      );
      return;
    }

    this.socket = io(`/?XTransformPort=${VOICE_SESSION_PORT}`, {
      ...SOCKET_CONFIG,
      // Pull query/path logic into socket.io's expected shape.
      // The gateway routes by XTransformPort query param.
       
    } as any);

    this.socket.on("connect", this.handleSocketConnect);
    this.socket.on("disconnect", this.handleSocketDisconnect);
    this.socket.on("connect_error", this.handleSocketConnectError);
    this.socket.on("reconnect_attempt", this.handleSocketReconnectAttempt);
    this.socket.on("reconnect_failed", this.handleSocketReconnectFailed);
    this.socket.on("session:ready", this.handleSessionReady);
    this.socket.on("session:ended", this.handleSessionEnded);
    this.socket.on("transcript:user", this.handleTranscriptUser);
    this.socket.on("transcript:assistant", this.handleTranscriptAssistant);
    this.socket.on("audio:chunk", this.handleAudioChunk);
    this.socket.on("audio:end", this.handleAudioEnd);
    this.socket.on("voice:state", this.handleServerVoiceState);
    this.socket.on("tool:called", this.handleToolCalled);
    this.socket.on("tool:result", this.handleToolResult);
    this.socket.on("error", this.handleError);
    this.socket.on("error:fatal", this.handleFatalError);
  }

  /**
   * Acquire the microphone and start listening.
   *
   * PRIMARY method: Web Speech API (browser-native speech recognition)
   *   - Runs in Chrome/Edge/Safari with NO rate limits
   *   - Real-time streaming transcription (interim results)
   *   - No 30-second audio limit
   *   - Audio never leaves the browser → better privacy
   *   - The transcript is sent to the server as a text:message, which
   *     means the server only needs to run LLM + TTS (no ASR calls at all)
   *
   * FALLBACK method: Server-side ASR via z-ai
   *   - Used when Web Speech API is not available (Firefox, older browsers)
   *   - Sends audio chunks + speech:end → server transcribes
   *   - Subject to z-ai rate limits and 30-second audio cap
   */
  async startListening(): Promise<void> {
    if (!this.socket?.connected || !this.sessionInfo) {
      this.emitError(
        "connection_failed",
        "Cannot start listening — session not connected.",
      );
      return;
    }
    if (this.isListening) return;

    // Try to use the browser's built-in speech recognition first.
    // This is the PREFERRED path — it eliminates the z-ai ASR rate limit
    // entirely for Chrome/Edge/Safari users.
    const SpeechRecognitionCtor =
      (window as unknown as { SpeechRecognition?: typeof SpeechRecognition })
        .SpeechRecognition ||
      (window as unknown as {
        webkitSpeechRecognition?: typeof SpeechRecognition;
      }).webkitSpeechRecognition;

    if (SpeechRecognitionCtor) {
      await this.startListeningWithWebSpeech(SpeechRecognitionCtor);
      return;
    }

    // Fallback: server-side ASR via z-ai (for Firefox etc.)
    console.log(
      "[realtime] Web Speech API not available — falling back to server-side ASR (z-ai). This may hit rate limits.",
    );
    await this.startListeningWithServerASR();
  }

  /**
   * PRIMARY ASR: Use the browser's built-in Web Speech API.
   *
   * The browser handles speech recognition locally (or via the browser's
   * own speech service) and gives us text transcripts in real-time. We
   * then send the transcript to the server as a `text:message` — the
   * server NEVER needs to call the z-ai ASR API, so there are no rate
   * limits and no 30-second audio cap.
   */
  private async startListeningWithWebSpeech(
    SpeechRecognitionCtor: new () => SpeechRecognition,
  ): Promise<void> {
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });
    } catch (err) {
      this.handleMicError(err);
      return;
    }

    try {
      // Set up the analyser for the visualizer (we still want the
      // audio level bars even though we're not sending audio to the
      // server).
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.audioContext = new Ctor();
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }
      this.sourceNode = this.audioContext.createMediaStreamSource(
        this.micStream,
      );
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = VAD_CONFIG.fftSize;
      this.analyser.smoothingTimeConstant = VAD_CONFIG.smoothingTimeConstant;
      this.sourceNode.connect(this.analyser);

      // Set up Web Speech API recognition.
      const recognition = new SpeechRecognitionCtor();
      recognition.lang = "en-US";
      recognition.continuous = false; // single-utterance mode
      recognition.interimResults = true; // get partial results as user speaks
      recognition.maxAlternatives = 1;

      let finalTranscript = "";
      let hasStartedSpeaking = false;

      recognition.onstart = () => {
        console.log("[realtime] Web Speech API recognition started");
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimText += result[0].transcript;
          }
        }
        // Show interim results live in the transcript so the user sees
        // their words appearing as they speak.
        if (interimText || finalTranscript) {
          hasStartedSpeaking = true;
          this.callbacks.onTranscriptUpdate?.(
            `interim-${this.currentTurnId}`,
            (finalTranscript + interimText).trim(),
            false,
          );
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error(
          `[realtime] Web Speech API error: ${event.error}`,
          event,
        );
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          this.emitError(
            "microphone_denied",
            "Microphone access was denied. Please allow it in your browser settings.",
          );
        } else if (event.error === "no-speech") {
          // No speech was detected — this is normal if the user clicked
          // the mic but didn't say anything. Just go back to ready.
          console.log("[realtime] no speech detected by Web Speech API");
        } else if (event.error === "aborted") {
          // Recognition was aborted (e.g. user clicked stop). Normal.
          console.log("[realtime] Web Speech API recognition aborted");
        } else {
          this.emitError(
            "asr_failed",
            `Speech recognition error: ${event.error}. Try again.`,
          );
        }
      };

      recognition.onend = () => {
        console.log(
          `[realtime] Web Speech API recognition ended. Final transcript: "${finalTranscript}"`,
        );
        // Clear the interim transcript placeholder.
        this.callbacks.onTranscriptUpdate?.(
          `interim-${this.currentTurnId}`,
          "",
          true,
        );

        // CRITICAL: Mark that we're no longer listening BEFORE we send
        // the transcript or reset state. Without this, the next tap on
        // the mic button would see isListening=true and bail out,
        // making the conversation appear "stuck" after one reply.
        this.isListening = false;

        if (finalTranscript.trim()) {
          // Send the transcript to the server as a text message — the
          // server processes it through the LLM + TTS pipeline.
          // NO audio is sent, so NO z-ai ASR call is made → no rate limits.
          this.setVoiceState("thinking");
          this.socket?.emit("text:message", { text: finalTranscript.trim() });
        } else {
          // No final transcript — go back to ready so the user can
          // immediately try again.
          this.setVoiceState("ready");
        }

        // Tear down the mic stream + audio context so the browser
        // releases the microphone hardware and the visualizer stops.
        // We do this AFTER emitting the text:message / setting state
        // so there's no race with the server's response.
        this.teardownListeningResources();
      };

      this.speechRecognition = recognition;
      this.isListening = true;
      this.setVoiceState("listening");
      console.log("[realtime] listening with Web Speech API (no rate limits)");
      recognition.start();

      // Start the visualizer tick (for the audio level bars).
      this.tickVad();
    } catch (err) {
      this.emitError(
        "microphone_unavailable",
        `Could not initialize speech recognition: ${err instanceof Error ? err.message : "unknown error"}`,
      );
      this.stopListening();
    }
  }

  /**
   * FALLBACK ASR: Server-side recognition via z-ai.
   * Used when the browser doesn't support the Web Speech API.
   */
  private async startListeningWithServerASR(): Promise<void> {
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: AUDIO_SAMPLE_RATE,
        },
      });
    } catch (err) {
      this.handleMicError(err);
      return;
    }

    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.audioContext = new Ctor({ sampleRate: AUDIO_SAMPLE_RATE });
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }
      this.sourceNode = this.audioContext.createMediaStreamSource(
        this.micStream,
      );

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = VAD_CONFIG.fftSize;
      this.analyser.smoothingTimeConstant = VAD_CONFIG.smoothingTimeConstant;
      this.sourceNode.connect(this.analyser);

      const BUFFER_SIZE = MIC_CAPTURE_CONFIG.bufferSize;
      this.processorNode = this.audioContext.createScriptProcessor(
        BUFFER_SIZE,
        1,
        1,
      );
      this.processorNode.onaudioprocess = (e) => {
        if (!this.socket?.connected || !this.isListening) return;
        const input = e.inputBuffer.getChannelData(0);
        const sampleRate = this.audioContext?.sampleRate ?? AUDIO_SAMPLE_RATE;

        let sum = 0;
        let peak = 0;
        for (let i = 0; i < input.length; i++) {
          const v = input[i];
          sum += v * v;
          const abs = Math.abs(v);
          if (abs > peak) peak = abs;
        }
        const rms = Math.sqrt(sum / input.length);

        const shouldSend =
          this.currentlySpeaking ||
          rms >= MIC_CAPTURE_CONFIG.bufferThreshold;

        if (!shouldSend) return;
        if (rms < MIC_CAPTURE_CONFIG.silenceDropThreshold) return;

        if (this.chunksSentThisTurn === 0) {
          console.log(
            `[realtime] mic capture starting: rms=${rms.toFixed(4)}, peak=${peak.toFixed(4)}`,
          );
        }
        this.chunksSentThisTurn++;

        const pcm16 = float32ToPcm16(input);
        const b64 = pcm16ToBase64(pcm16);
        this.socket.emit("audio:chunk", {
          chunk: b64,
          sampleRate,
        });
      };
      this.sourceNode.connect(this.processorNode);
      const muteGain = this.audioContext.createGain();
      muteGain.gain.value = 0;
      this.processorNode.connect(muteGain);
      muteGain.connect(this.audioContext.destination);

      this.isListening = true;
      this.vadState = "idle";
      this.currentlySpeaking = false;
      this.chunksSentThisTurn = 0;
      this.setVoiceState("listening");
      console.log("[realtime] listening with server-side ASR (z-ai)");
      this.tickVad();
    } catch (err) {
      this.emitError(
        "microphone_unavailable",
        `Could not initialize audio: ${err instanceof Error ? err.message : "unknown error"}`,
      );
      this.stopListening();
    }
  }

  private handleMicError(err: unknown): void {
    const name = err instanceof Error ? err.name : "Unknown";
    if (name === "NotAllowedError" || name === "SecurityError") {
      this.emitError(
        "microphone_denied",
        "Microphone access was denied. Please allow it in your browser settings.",
      );
    } else if (name === "NotFoundError" || name === "OverconstrainedError") {
      this.emitError(
        "microphone_unavailable",
        "No microphone was found. Please connect one and try again.",
      );
    } else {
      this.emitError(
        "microphone_unavailable",
        `Could not access microphone: ${err instanceof Error ? err.message : "unknown error"}`,
      );
    }
  }

  /**
   * Stop capturing microphone audio. Does NOT end the session — the user
   * can switch to text mode or start listening again.
   */
  stopListening(): void {
    if (this.vadRafId !== null) {
      cancelAnimationFrame(this.vadRafId);
      this.vadRafId = null;
    }
    this.isListening = false;
    this.vadState = "idle";
    this.currentlySpeaking = false;
    this.chunksSentThisTurn = 0;
    this.currentTurnId++;

    // Stop Web Speech API recognition if it's running.
    if (this.speechRecognition) {
      try {
        this.speechRecognition.stop();
      } catch {
        // Already stopped — ignore.
      }
      this.speechRecognition = null;
    }

    this.teardownListeningResources();

    // If we were speaking before, we stay in speaking state (driven by the
    // server). Otherwise go back to ready.
    if (
      this.voiceState === "listening" ||
      this.voiceState === "interrupted"
    ) {
      this.setVoiceState("ready");
    }
  }

  /**
   * Tear down mic stream, audio context, analyser, and processor.
   *
   * This is the resource-cleanup half of `stopListening()`, split out so
   * that the Web Speech API's `recognition.onend` callback can tear down
   * the mic resources WITHOUT prematurely setting isListening=false (which
   * it has already done before calling this method).
   *
   * Safe to call multiple times — all fields are nullable and we guard
   * every access.
   */
  private teardownListeningResources(): void {
    try {
      this.processorNode?.disconnect();
      this.analyser?.disconnect();
      this.sourceNode?.disconnect();
    } catch {
      // ignore — already disconnected
    }
    this.processorNode = null;
    this.analyser = null;
    this.sourceNode = null;

    if (this.micStream) {
      for (const track of this.micStream.getTracks()) track.stop();
      this.micStream = null;
    }
    // NOTE: We intentionally do NOT close the AudioContext here, because
    // the same AudioContext might be shared with the playback path (for
    // the visualizer). Closing it would break audio playback. The context
    // will be garbage-collected when the page unloads.
    // We DO disconnect the source/analyser/processor above so the mic
    // hardware is released.
  }

  /**
   * Manually signal end-of-speech (used when the UI has its own push-to-talk
   * gate, or for testing). In normal operation the VAD loop calls this.
   *
   * For the Web Speech API path, calling `recognition.stop()` triggers the
   * `onend` callback, which sends the final transcript to the server.
   * For the server-side ASR path, we emit `speech:end` directly.
   */
  signalSpeechEnd(): void {
    if (!this.socket?.connected || !this.isListening) return;

    if (this.speechRecognition) {
      // Web Speech API path — stop recognition, which fires onend
      // → sends the transcript as text:message
      console.log("[realtime] stopping Web Speech API recognition (push to talk)");
      try {
        this.speechRecognition.stop();
      } catch {
        // Already stopped — ignore.
      }
      return;
    }

    // Server-side ASR path — emit speech:end with the accumulated audio.
    const sampleRate = this.audioContext?.sampleRate ?? AUDIO_SAMPLE_RATE;
    console.log(
      `[realtime] speech:end signaled — sent ${this.chunksSentThisTurn} chunks this turn`,
    );
    this.socket.emit("speech:end", { sampleRate });
    this.setVoiceState("thinking");
  }

  /**
   * Barge-in: tell the server to cancel the active AI turn.
   * Called by the VAD loop when user speech is detected during `speaking`.
   */
  interrupt(): void {
    if (!this.socket?.connected) return;
    if (
      this.voiceState !== "speaking" &&
      this.voiceState !== "thinking"
    ) {
      return;
    }
    this.socket.emit("speech:interrupt");
    // Cancel any locally-buffered playback so the speaker actually stops.
    this.cancelPlayback();
    this.setVoiceState("interrupted");
  }

  /** Send a typed text message. Shares the same conversation context. */
  sendText(text: string): void {
    const trimmed = text.trim();
    if (!trimmed || !this.socket?.connected) return;
    this.socket.emit("text:message", { text: trimmed });
    this.setVoiceState("thinking");
  }

  /** Cancel any in-flight AI response without providing a new turn. */
  cancelResponse(): void {
    if (!this.socket?.connected) return;
    this.socket.emit("response:cancel");
    this.cancelPlayback();
    this.setVoiceState("ready");
  }

  /** Tear everything down. */
  disconnect(): void {
    this.continuousMode = false;
    this.stopListening();
    this.cancelPlayback();
    if (this.socket?.connected) {
      this.socket.emit("session:end");
    }
    this.socket?.disconnect();
    this.socket = null;
    this.sessionInfo = null;
    this.reconnectAttempts = 0;
    this.setConnectionStatus("disconnected");
    this.setVoiceState("disconnected");
  }

  // -----------------------------------------------------------------------
  // Socket event handlers
  // -----------------------------------------------------------------------

  private handleSocketConnect = () => {
    this.reconnectAttempts = 0;
    this.setConnectionStatus("connected");
    if (this.sessionInfo) {
      this.socket?.emit("session:start", {
        sessionId: this.sessionInfo.sessionId,
        token: this.sessionInfo.token,
      });
    }
  };

  private handleSocketDisconnect = () => {
    this.setConnectionStatus("disconnected");
    // Keep voice state as-is — the server may resume on reconnect.
    this.stopListening();
    this.cancelPlayback();
  };

  private handleSocketConnectError = (err: Error) => {
    console.error("[realtime] connect_error", err);
    this.setConnectionStatus("disconnected");
    if (this.reconnectAttempts >= SOCKET_CONFIG.reconnectionAttempts) {
      this.emitFatal(
        "connection_failed",
        "Could not connect to the voice session service.",
      );
    }
  };

  private handleSocketReconnectAttempt = (attempt: number) => {
    this.reconnectAttempts = attempt;
    this.setConnectionStatus("reconnecting");
  };

  private handleSocketReconnectFailed = () => {
    this.setConnectionStatus("disconnected");
    this.emitFatal(
      "connection_failed",
      "Could not reconnect to the voice session after multiple attempts.",
    );
  };

  private handleSessionReady = (payload: { sessionId: string }) => {
    console.log(`[realtime] session ready: ${payload.sessionId}`);
    this.setVoiceState("ready");
    if (this.sessionInfo) {
      this.callbacks.onSessionReady?.(this.sessionInfo);
    }
  };

  private handleSessionEnded = () => {
    this.setVoiceState("disconnected");
    this.setConnectionStatus("disconnected");
  };

  private handleTranscriptUser = (payload: {
    id: string;
    text: string;
    final: boolean;
  }) => {
    this.callbacks.onTranscript?.({
      id: payload.id,
      role: "user",
      content: payload.text,
      createdAt: new Date().toISOString(),
    });
  };

  private handleTranscriptAssistant = (payload: {
    id: string;
    text: string;
    final: boolean;
  }) => {
    this.callbacks.onTranscriptUpdate?.(
      payload.id,
      payload.text,
      payload.final,
    );
    if (payload.final && payload.text) {
      this.callbacks.onTranscript?.({
        id: payload.id,
        role: "assistant",
        content: payload.text,
        createdAt: new Date().toISOString(),
      });
    }
  };

  private handleAudioChunk = (payload: {
    id: string;
    chunk: string;
    sampleRate: number;
    format?: "pcm" | "wav";
  }) => {
    this.enqueuePlayback(
      payload.id,
      payload.chunk,
      payload.sampleRate,
      payload.format,
    );
  };

  private handleAudioEnd = (payload: { id: string }) => {
    const turn = this.activeTurns.get(payload.id);
    if (turn) {
      turn.ended = true;
      // Try to drain — if there are pending decodes, the decode callbacks
      // will call schedulePlayback themselves, which will drain then.
      if (turn.pendingDecodes === 0) {
        this.schedulePlayback();
      } else {
        console.log(
          `[realtime] audio:end for ${payload.id} — deferring cleanup, ${turn.pendingDecodes} decode(s) pending`,
        );
      }
    }
  };

  private handleServerVoiceState = (payload: { state: VoiceState }) => {
    // CRITICAL SAFETY NET: When the server says we're back to "ready",
    // make sure our local listening state is also reset. Without this,
    // a stuck isListening=true flag would prevent the user from ever
    // tapping the mic again — making the conversation appear "stuck".
    if (payload.state === "ready" && this.isListening) {
      console.log(
        "[realtime] server says ready but isListening=true — forcing reset",
      );
      this.isListening = false;
      this.teardownListeningResources();
    }

    this.setVoiceState(payload.state);

    // CONTINUOUS MODE: when the AI finishes speaking (state = ready),
    // automatically restart listening so the user can speak again
    // without tapping the mic button. We add a small delay (500ms) to
    // give the audio playback system time to fully clean up before we
    // re-acquire the microphone.
    if (
      payload.state === "ready" &&
      this.continuousMode &&
      !this.isListening &&
      this.socket?.connected
    ) {
      console.log(
        "[realtime] continuous mode: auto-restarting listening in 500ms",
      );
      setTimeout(() => {
        // Re-check all conditions inside the timeout — the user might
        // have tapped to stop, or the socket might have disconnected,
        // during the 500ms delay.
        if (
          this.continuousMode &&
          !this.isListening &&
          this.socket?.connected &&
          this.voiceState === "ready"
        ) {
          this.startListening();
        } else {
          console.log(
            "[realtime] continuous mode: auto-restart cancelled (conditions changed)",
          );
        }
      }, 500);
    }
  };

  private handleToolCalled = (payload: {
    id: string;
    name: string;
    args: unknown;
  }) => {
    this.callbacks.onToolCalled?.(payload.id, payload.name, payload.args);
  };

  private handleToolResult = (payload: {
    id: string;
    name: string;
    ok: boolean;
    result?: unknown;
    error?: string;
  }) => {
    this.callbacks.onToolResult?.(
      payload.id,
      payload.name,
      payload.ok,
      payload.result,
      payload.error,
    );
  };

  private handleError = (payload: { code: string; message: string }) => {
    this.callbacks.onError?.(
      payload.code as RealtimeErrorCode,
      payload.message,
    );
  };

  private handleFatalError = (payload: {
    code: string;
    message: string;
  }) => {
    this.emitFatal(payload.code as RealtimeErrorCode, payload.message);
  };

  // -----------------------------------------------------------------------
  // Voice Activity Detection (VAD)
  //
  // Runs entirely on the client using the AnalyserNode's time-domain data.
  // Computes RMS volume, hysteresis-thresholds between "speaking" and
  // "silence", and signals end-of-speech after `silenceDurationMs` of
  // continuous silence.
  // -----------------------------------------------------------------------

  private tickVad = () => {
    if (!this.isListening || !this.analyser) {
      this.vadRafId = null;
      return;
    }
    const buf = new Uint8Array(this.analyser.fftSize);
    this.analyser.getByteTimeDomainData(buf);
    // RMS of the centered signal.
    let sum = 0;
    for (let i = 0; i < buf.length; i++) {
      const v = (buf[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / buf.length);
    this.callbacks.onAudioLevel?.(rms);

    const now = performance.now();
    if (rms >= VAD_CONFIG.speechThreshold) {
      if (this.vadState === "idle") {
        this.speechStartTs = now;
        this.vadState = "speaking";
        this.currentlySpeaking = true;
      } else if (this.vadState === "silence-after-speech") {
        // Resumed speaking before silence timeout fired.
        this.vadState = "speaking";
        this.currentlySpeaking = true;
      }
      // Barge-in: if AI is speaking and user starts speaking, interrupt.
      if (this.voiceState === "speaking") {
        // Make sure the speech is sustained, not just a transient click.
        if (now - this.speechStartTs > VAD_CONFIG.minSpeechDurationMs) {
          this.interrupt();
        }
      }
      this.silenceStartTs = 0;
    } else if (rms < VAD_CONFIG.silenceThreshold) {
      if (this.vadState === "speaking") {
        this.vadState = "silence-after-speech";
        this.silenceStartTs = now;
        // Keep currentlySpeaking=true during the silence-after-speech
        // window so we don't miss the next word if the user just paused
        // briefly.
      } else if (
        this.vadState === "silence-after-speech" &&
        this.silenceStartTs > 0
      ) {
        const elapsed = now - this.silenceStartTs;
        const speechDuration = this.silenceStartTs - this.speechStartTs;
        if (
          elapsed >= VAD_CONFIG.silenceDurationMs &&
          speechDuration >= VAD_CONFIG.minSpeechDurationMs
        ) {
          // End-of-speech confirmed.
          this.vadState = "idle";
          this.currentlySpeaking = false;
          this.signalSpeechEnd();
        }
      }
    }

    this.vadRafId = requestAnimationFrame(this.tickVad);
  };

  // -----------------------------------------------------------------------
  // PCM playback — schedules audio chunks via Web Audio API in arrival
  // order, with a small initial buffer to absorb jitter.
  // -----------------------------------------------------------------------

  private enqueuePlayback(
    turnId: string,
    chunkB64: string,
    sampleRate: number,
    format?: "pcm" | "wav",
  ) {
    let turn = this.activeTurns.get(turnId);
    if (!turn) {
      turn = {
        id: turnId,
        chunks: [],
        totalSamples: 0,
        ended: false,
        started: false,
        cancelled: false,
        sources: [],
        pendingDecodes: 0,
      };
      this.activeTurns.set(turnId, turn);
    }
    if (turn.cancelled) return;

    if (format === "wav") {
      // Track that there's a pending async decode for this turn —
      // prevents `audio:end` from prematurely clearing the turn.
      turn.pendingDecodes++;
      this.decodeWavChunk(turn, chunkB64);
      return;
    }

    // Legacy PCM path — manual 16-bit PCM decode + (optional) resample.
    const pcm = base64ToPcm16(chunkB64);
    const float = pcm16ToFloat32(pcm);
    let finalFloat = float;
    if (sampleRate !== AUDIO_SAMPLE_RATE) {
      finalFloat = resampleLinear(float, sampleRate, AUDIO_SAMPLE_RATE);
    }
    turn.chunks.push(finalFloat);
    turn.totalSamples += finalFloat.length;
    this.schedulePlayback();
  }

  /**
   * Ensure the playback AudioContext exists and is running.
   *
   * CRITICAL: Browsers (Chrome 71+, Safari, Firefox) block AudioContext
   * from producing sound until it has been resumed by a user gesture
   * (click, tap, keypress). If we create the context lazily when the
   * first audio chunk arrives (which is NOT a user gesture), the context
   * stays "suspended" and NO AUDIO PLAYS — even though the BufferSourceNode
   * fires its `onended` event.
   *
   * This method MUST be called from a click handler (e.g. the voice button
   * click) to "unlock" audio playback for the rest of the session.
   */
  ensurePlaybackUnlocked(): void {
    if (!this.playbackContext) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.playbackContext = new Ctor({ sampleRate: AUDIO_SAMPLE_RATE });
    }
    if (this.playbackContext.state === "suspended") {
      // resume() returns a Promise; we don't await it here because we want
      // the user gesture to return immediately. The context will become
      // "running" shortly.
      this.playbackContext.resume().catch((err) => {
        console.warn("[realtime] could not resume playback AudioContext", err);
      });
    }
    // Sanity log — helpful for debugging "no audio" issues.
    console.log(
      `[realtime] playback context state: ${this.playbackContext.state}`,
    );
  }

  /**
   * Decode a base64-encoded WAV blob via the browser's AudioContext, then
   * schedule the decoded audio for playback. Async — fires-and-forgets.
   */
  private decodeWavChunk(turn: ActivePlaybackTurn, chunkB64: string) {
    if (!this.playbackContext) {
      // Defensive: should not happen because ensurePlaybackUnlocked() is
      // called on the voice button click. But just in case, create it now.
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.playbackContext = new Ctor({ sampleRate: AUDIO_SAMPLE_RATE });
    }
    if (this.playbackContext.state === "suspended") {
      this.playbackContext.resume().catch(() => {});
    }

    // base64 → ArrayBuffer
    const binary = atob(chunkB64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    // decodeAudioData needs a fresh ArrayBuffer copy (it neutered the input)
    const arrayBuffer = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength,
    );

    if (turn.cancelled) {
      turn.pendingDecodes--;
      return;
    }

    // Use the callback form of decodeAudioData for maximum browser
    // compatibility (Safari <14 doesn't support the Promise form).
    try {
      (this.playbackContext as AudioContext).decodeAudioData(
        arrayBuffer as ArrayBuffer,
        (audioBuffer: AudioBuffer) => {
          // Decode succeeded — decrement pending count.
          turn.pendingDecodes--;
          if (turn.cancelled) return;
          // Flatten to a single Float32Array (mono — if stereo, take the
          // first channel; we requested mono TTS so this is always mono).
          const channelData = audioBuffer.getChannelData(0);
          // Copy — the underlying buffer may be GC'd once we drop the
          // AudioBuffer reference.
          const copy = new Float32Array(channelData.length);
          copy.set(channelData);
          turn.chunks.push(copy);
          turn.totalSamples += copy.length;
          console.log(
            `[realtime] WAV decoded: ${copy.length} samples (${(copy.length / AUDIO_SAMPLE_RATE).toFixed(2)}s), pending=${turn.pendingDecodes}, ended=${turn.ended}`,
          );
          this.schedulePlayback();
        },
        (err: unknown) => {
          turn.pendingDecodes--;
          console.error("[realtime] decodeAudioData error callback", err);
        },
      );
    } catch (err) {
      turn.pendingDecodes--;
      console.error("[realtime] decodeAudioData threw", err);
    }
  }

  private cancelPlayback() {
    for (const turn of this.activeTurns.values()) {
      turn.cancelled = true;
      turn.chunks = [];
      // Stop any in-flight BufferSourceNodes so they don't keep playing
      // after barge-in.
      for (const src of turn.sources) {
        try {
          src.stop();
        } catch {
          // Already stopped / never started — ignore.
        }
        try {
          src.disconnect();
        } catch {
          // Already disconnected — ignore.
        }
      }
      turn.sources = [];
    }
    this.activeTurns.clear();
    this.nextPlaybackOffset = 0;
    this.playbackStartTime = 0;
  }

  private schedulePlayback = () => {
    if (!this.playbackContext) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.playbackContext = new Ctor({ sampleRate: AUDIO_SAMPLE_RATE });
    }
    if (this.playbackContext.state === "suspended") {
      this.playbackContext.resume().catch(() => {});
    }

    const now = this.playbackContext.currentTime;

    // CRITICAL: Browsers block AudioContext from producing sound until
    // resumed by a user gesture. If the context is still "suspended"
    // here, the user hasn't clicked yet — audio will not play. Log this
    // loudly so it's obvious in the console.
    if (this.playbackContext.state === "suspended") {
      console.warn(
        "[realtime] playback AudioContext is suspended — audio will not play until user interacts with the page",
      );
    }

    // Initialize the timeline if needed.
    if (this.playbackStartTime === 0) {
      this.playbackStartTime = now + PLAYBACK_CONFIG.initialBufferSeconds;
      this.nextPlaybackOffset = 0;
    }

    // CRITICAL FIX: If we've fallen behind real-time (e.g. because
    // decodeAudioData took a while, or the network was slow), the
    // scheduled `start` time would be in the past — Web Audio would
    // either skip the audio or glitch. Detect this and reschedule from
    // "now + a small buffer" so the audio always plays cleanly.
    const scheduledEndTime =
      this.playbackStartTime +
      this.nextPlaybackOffset / AUDIO_SAMPLE_RATE;
    if (scheduledEndTime < now + 0.02) {
      this.playbackStartTime = now + PLAYBACK_CONFIG.initialBufferSeconds;
      this.nextPlaybackOffset = 0;
    }

    // If we've fallen too far BEHIND in the other direction (too much
    // audio queued up in the future), drop the oldest unscheduled chunks
    // to catch up. This is rare — only happens if TTS was way faster
    // than playback.
    const maxAhead = PLAYBACK_CONFIG.maxBufferSeconds * AUDIO_SAMPLE_RATE;
    const expectedSample = Math.floor(
      (now - this.playbackStartTime) * AUDIO_SAMPLE_RATE,
    );
    if (this.nextPlaybackOffset - expectedSample > maxAhead) {
      this.nextPlaybackOffset = expectedSample + Math.floor(maxAhead / 2);
    }

    let scheduledCount = 0;
    let totalChunksAvailable = 0;
    for (const turn of this.activeTurns.values()) {
      totalChunksAvailable += turn.chunks.length;
      if (turn.chunks.length === 0) continue;
      // Schedule all queued chunks back-to-back starting from the next free
      // slot. With the WAV approach, each turn typically has exactly ONE
      // chunk (the whole decoded audio), so this loop runs once.
      for (const chunk of turn.chunks) {
        const buffer = this.playbackContext.createBuffer(
          1,
          chunk.length,
          AUDIO_SAMPLE_RATE,
        );
        buffer.getChannelData(0).set(chunk);
        const src = this.playbackContext.createBufferSource();
        src.buffer = buffer;
        src.connect(this.playbackContext.destination);
        const start =
          this.playbackStartTime +
          this.nextPlaybackOffset / AUDIO_SAMPLE_RATE;
        // Defensive: never schedule in the past.
        const safeStart = Math.max(start, now + 0.005);
        try {
          src.start(safeStart);
          // CRITICAL: hold a reference so the GC doesn't kill the
          // BufferSourceNode before it finishes playing.
          turn.sources.push(src);
          this.nextPlaybackOffset += chunk.length;
          turn.started = true;
          scheduledCount++;
          // When the source finishes, remove it from the held list so
          // we don't leak memory across a long session.
          src.onended = () => {
            const idx = turn.sources.indexOf(src);
            if (idx >= 0) turn.sources.splice(idx, 1);
          };
        } catch (err) {
          console.error("[realtime] BufferSource.start() failed", err);
        }
      }
      turn.chunks = [];
    }

    // Always log when schedulePlayback is called, even if nothing was
    // scheduled — this helps diagnose "audio decoded but never played".
    console.log(
      `[realtime] schedulePlayback: ${scheduledCount}/${totalChunksAvailable} chunks scheduled, context=${this.playbackContext.state}, t=${now.toFixed(3)}s, start=${this.playbackStartTime.toFixed(3)}s`,
    );

    // If all turns have ended and have nothing left to schedule AND no
    // pending decodes, reset the timeline so the next turn starts fresh.
    // CRITICAL: if pendingDecodes > 0, the audio:chunk has arrived but
    // decodeAudioData hasn't called back yet — clearing the turn now
    // would cause the decoded audio to be added to a non-existent turn
    // and silently never play.
    const allDrained = Array.from(this.activeTurns.values()).every(
      (t) =>
        t.ended &&
        t.chunks.length === 0 &&
        t.pendingDecodes === 0 &&
        t.sources.length === 0,
    );
    if (allDrained) {
      this.activeTurns.clear();
      this.playbackStartTime = 0;
      this.nextPlaybackOffset = 0;
    }
  };

  // -----------------------------------------------------------------------
  // State helpers
  // -----------------------------------------------------------------------

  private setVoiceState(next: VoiceState) {
    if (this.voiceState === next) return;
    this.voiceState = next;
    this.callbacks.onVoiceStateChange?.(next);
  }

  private setConnectionStatus(next: ConnectionStatus) {
    if (this.connectionStatus === next) return;
    this.connectionStatus = next;
    this.callbacks.onConnectionStatusChange?.(next);
  }

  private emitError(code: RealtimeErrorCode, message: string) {
    this.callbacks.onError?.(code, message);
  }

  private emitFatal(code: RealtimeErrorCode, message: string) {
    this.setVoiceState("error");
    this.callbacks.onFatalError?.(code, message);
  }
}

// ---------------------------------------------------------------------------
// Audio conversion helpers
// ---------------------------------------------------------------------------

function float32ToPcm16(input: Float32Array): Int16Array {
  const out = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out;
}

function pcm16ToFloat32(input: Int16Array): Float32Array {
  const out = new Float32Array(input.length);
  for (let i = 0; i < input.length; i++) {
    out[i] = input[i] / 0x8000;
  }
  return out;
}

function pcm16ToBase64(pcm: Int16Array): string {
  // Write to a Uint8Array view and then base64-encode.
  const bytes = new Uint8Array(pcm.buffer, pcm.byteOffset, pcm.byteLength);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToPcm16(b64: string): Int16Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Int16Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 2);
}

function resampleLinear(
  input: Float32Array,
  fromRate: number,
  toRate: number,
): Float32Array {
  if (fromRate === toRate) return input;
  const ratio = toRate / fromRate;
  const outLength = Math.floor(input.length * ratio);
  const out = new Float32Array(outLength);
  for (let i = 0; i < outLength; i++) {
    const srcIndex = i / ratio;
    const i0 = Math.floor(srcIndex);
    const i1 = Math.min(i0 + 1, input.length - 1);
    const t = srcIndex - i0;
    out[i] = input[i0] * (1 - t) + input[i1] * t;
  }
  return out;
}
