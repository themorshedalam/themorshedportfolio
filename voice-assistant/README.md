# Real-Time Natural Voice AI Assistant

A web-based AI assistant that provides a natural, continuous, two-way voice conversation. Built per the PRD (v1.1) — streaming audio, voice activity detection, barge-in, live transcript, conversation history, text + voice modes, tool calling, and a secure backend.

> The assistant uses a **natural male voice** (`jam` — British gentleman) by default. The voice is configurable via the `REALTIME_VOICE` env var without rebuilding the frontend.

---

## Architecture

```
                 ┌────────────────────────────┐
                 │      REALTIME SESSION       │
                 │   (socket.io mini-service)   │
                 │                             │
   MICROPHONE ──►│  Audio streaming (PCM)      │
                 │  Turn detection (VAD)       │
                 │  Conversation state         │
                 │  LLM reasoning              │
                 │  Tool calling               │
                 │  Interruption (barge-in)    │
                 │  Streaming male voice       │
   SPEAKER ◄────│  (sentence-by-sentence TTS)  │
                 │                             │
                 └────────────────────────────┘
                              ▲
                              │ socket.io (port 3003 via gateway)
                              │ + short-lived HMAC token
                              │
   Browser  ◄────►  Next.js app  ◄────►  /api/realtime/session
   (React UI)        (port 3000)            (mints session tokens)
```

**Key design choice**: This is NOT a sequential `record → upload → STT → wait → LLM → wait → TTS → play` pipeline. Audio is streamed, the LLM is invoked as soon as the user's turn ends, and TTS is fired **sentence-by-sentence** so the first audio chunk reaches the speaker as quickly as possible.

---

## Project Structure

```
voice-assistant/
├── src/
│   ├── app/
│   │   ├── api/realtime/session/route.ts   ← mints short-lived session tokens
│   │   ├── layout.tsx
│   │   ├── page.tsx                          ← main conversational UI
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                               ← shadcn/ui primitives
│   │   └── voice/
│   │       ├── VoiceButton.tsx               ← large central mic control
│   │       ├── VoiceVisualizer.tsx           ← realtime audio bars
│   │       ├── VoiceStatus.tsx               ← voice state chip
│   │       ├── ConnectionStatus.tsx          ← connection state chip
│   │       ├── Transcript.tsx                ← live conversation history
│   │       └── Conversation.tsx              ← header (status + actions)
│   ├── lib/
│   │   ├── realtime.ts                       ← RealtimeSession class (client)
│   │   ├── auth.ts                           ← auth scaffolding
│   │   ├── tools.ts                          ← tool registry (server)
│   │   └── config.ts                         ← client runtime config
│   └── types/
│       └── voice.ts                          ← shared types
├── mini-services/
│   └── voice-session/                        ← socket.io realtime session (port 3003)
│       ├── index.ts
│       └── package.json
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Security model

The permanent API key NEVER reaches the browser. The flow:

1. Browser → `POST /api/realtime/session` (Next.js API route, server-only)
2. The route verifies the caller (auth stub — replace with real auth in production) and issues a short-lived HMAC-signed token bound to a fresh `sessionId`.
3. Browser opens a socket.io connection to the voice-session mini-service and presents the token.
4. The mini-service validates the token using the same `REALTIME_TOKEN_SECRET` as the API route.
5. All AI / TTS / ASR calls happen server-side in the mini-service. The browser only ever sees PCM audio chunks + transcript events + tool-call notifications.

### Verification

After running the app, inspect browser-visible source / network payloads:

- ❌ `OPENAI_API_KEY` must NOT appear
- ❌ No permanent credentials in client bundles
- ❌ No secrets in Git (`git grep -E '(OPENAI_API_KEY|REALTIME_TOKEN_SECRET)'` should match only `.env.example`)

---

## Tool calling

The architecture is extensible — tools are defined in `src/lib/tools.ts` (mirrored in `mini-services/voice-session/index.ts` so the mini-service stays independent). Each tool declares:

- a stable `name`
- a Zod `params` schema (validated BEFORE execution — model args are never trusted)
- a `requiredScope` for authorization
- a server-side `execute` function

The model is instructed (via the system prompt) to emit tool calls as a single JSON line:

```json
{"tool":"getServerTime","args":{"timezone":"Asia/Dubai"}}
```

When the model emits such a directive, the backend:

1. Validates the tool name + arguments against the schema
2. Authorizes the call against the caller's scopes (anonymous calls are denied for scoped tools)
3. Executes the tool server-side
4. Pushes the result back into the conversation as a system message
5. Re-prompts the model so it can phrase a natural spoken response

### Built-in demo tools

| Tool | Scope | Description |
| --- | --- | --- |
| `getServerTime` | _(none)_ | Returns the current server time in any IANA timezone |
| `searchProjects` | `projects:read` | Searches the user's projects (mock — returns "unauthorized" for anonymous callers) |

---

## Voice state machine

The frontend maintains an explicit voice state, separately from connection status:

```
disconnected → connecting → ready → listening → thinking → speaking → ready
                                                  ▲              │
                                                  │              ▼
                                                  └──── interrupted
```

States: `disconnected`, `connecting`, `ready`, `listening`, `thinking`, `speaking`, `interrupted`, `error`.

Each state is visually communicated **without relying on color alone** — the icon, label, and ring pulse pattern all change.

---

## Barge-in / interruption

The user can interrupt the AI at any time by simply speaking. The flow:

1. Client-side VAD detects user speech while the assistant is in `speaking` state
2. The client cancels any locally-buffered PCM playback (so the speaker actually stops)
3. The client emits a `speech:interrupt` event to the backend
4. The backend sets a cancellation flag — any in-flight LLM/TTS calls check this flag and bail out
5. The assistant state transitions to `interrupted`, then back to `ready` after a brief cooldown
6. The new user turn is captured and a fresh AI response is generated

The user **never needs to press Stop**. The old response never resumes after the interruption.

---

## Running locally

### Prerequisites

- Node.js 18+ / Bun
- A working microphone

### Install & start

```bash
# 1. Install frontend dependencies
bun install

# 2. Copy env template and adjust if needed
cp .env.example .env

# 3. Start the voice-session mini-service (port 3003)
cd mini-services/voice-session
bun install
bun run dev          # or: bun index.ts
# → leave this running in a separate terminal

# 4. Start the Next.js app (port 3000)
cd ../..
bun run dev
```

Open <http://localhost:3000> (or the gateway URL on port 81 if running behind Caddy).

> The browser must grant microphone permission. The first time you tap the mic button, the browser will prompt for permission.

---

## Testing checklist

### Connection
- [x] Application loads
- [x] Microphone permission prompt appears
- [x] Realtime session connects (token issued, socket authenticated)
- [x] Connection state visible
- [x] Disconnect / reconnect works

### Conversation
- [x] User can speak naturally (VAD detects end-of-speech automatically)
- [x] AI understands the user (ASR transcription)
- [x] Male AI voice responds (TTS with `jam` voice)
- [x] Audio streams (sentence-by-sentence TTS, playback via Web Audio API)
- [x] Multiple turns work (conversation history preserved per session)
- [x] Context retained across turns

### Interruption (mandatory acceptance test)
- [x] User can interrupt AI by speaking
- [x] Male AI voice stops
- [x] Current response is cancelled appropriately
- [x] New user speech is captured
- [x] New response begins
- [x] Old response does not resume

### UI
- [x] Listening / thinking / speaking / interrupted states visible
- [x] Connection status visible
- [x] Live transcript
- [x] Conversation history (scrollable)
- [x] Mobile layout (touch-friendly)
- [x] Desktop layout

### Security
- [x] Permanent API key remains server-side
- [x] Browser receives only short-lived HMAC tokens
- [x] Tool authorization enforced server-side
- [x] Secrets are not logged

### Tools
- [x] `getServerTime` demo tool works (ask "What time is it in Dubai?")
- [x] `searchProjects` correctly refuses anonymous callers
- [x] Tool results surface in the transcript UI

---

## Production deployment

1. **Set production env vars** (do NOT use the dev fallback secret):
   ```bash
   REALTIME_TOKEN_SECRET=$(openssl rand -hex 32)
   REALTIME_VOICE=jam           # or: xiaochen
   REALTIME_MODEL=gpt-4o-mini
   ```
2. **Wire in real authentication** in `src/lib/auth.ts` (NextAuth, JWT, your OAuth provider, etc.). Update `verifyUser()` to actually authenticate the request and return the user + scopes.
3. **Run both processes** behind a reverse proxy:
   - Next.js app on port 3000
   - voice-session mini-service on port 3003
   - Caddy / Nginx routes `?XTransformPort=3003` to the mini-service (see `Caddyfile`)
4. **TLS**: terminate TLS at the reverse proxy. WebSocket upgrades require `wss://` in production.
5. **Persistence (optional)**: if you want to store transcripts, add a Prisma model and write to it from the mini-service. Update your privacy policy and retention rules accordingly.

---

## Known limitations

1. **ASR is non-streaming** — the z-ai-web-dev-sdk ASR endpoint accepts a single base64-encoded audio blob per call. The client captures the entire user turn (via VAD-detected end-of-speech) and sends it once. This is a slight departure from a true real-time ASR stream, but it preserves the real-time conversation feel because (a) the AI response starts streaming as soon as the user finishes speaking, and (b) TTS is sentence-by-sentence so the first audio plays while later sentences are still being generated.
2. **No persistence by default** — conversations live in memory for the duration of the session and are discarded on disconnect. Add a database layer (Prisma is already wired in) if you need transcripts.
3. **Demo tools are mocked** — `searchProjects` returns hardcoded data and denies anonymous callers. Replace with a real database query and your auth system.
4. **Auth stub** — `verifyUser()` returns `null` (anonymous). Production deployments MUST replace this.
5. **Single-region** — both the Next.js app and the mini-service must run in the same region with low latency between them.

---

## Privacy

- ❌ Raw microphone audio is NOT stored. Audio chunks are processed in-memory by the mini-service for ASR and immediately discarded.
- ❌ Raw microphone audio is NOT logged.
- ❌ API secrets are NOT exposed to the browser.
- ⚠️ Transcripts are stored only in-memory for the session. If you add persistence, update your privacy policy and inform users.
- ✅ Tool calls are surfaced in the UI for transparency.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Realtime transport | socket.io (with WebSocket upgrade) |
| Audio I/O (browser) | Web Audio API (AnalyserNode + ScriptProcessorNode) |
| AI / ASR / TTS | z-ai-web-dev-sdk (server-only) |
| Validation | Zod |
| State | React hooks (per-page state machine) |

---

## Acceptance test

The MVP passes the PRD's definitive acceptance test:

> **USER**: "Can you help me build a website?"
> **AI**: "Absolutely. What kind of website—"
> **USER**: "Wait, actually."
> **AI**: [STOPS]
> **USER**: "I want to build a mobile app."
> **AI**: "Got it. Let's focus on the mobile app..."

The interaction is continuous and natural — the user can interrupt mid-sentence by simply speaking, and the assistant stops immediately, listens to the new turn, and responds without the old response resuming.
