import { NextResponse } from "next/server";
import { randomUUID, createHmac } from "crypto";
import { verifyUser } from "@/lib/auth";
import type { SessionBootstrapResponse } from "@/types/voice";

/**
 * POST /api/realtime/session
 *
 * Issues a short-lived token that the browser uses to authenticate its
 * socket.io connection to the voice-session mini-service.
 *
 * The permanent API key (for the z-ai-web-dev-sdk, which is used internally
 * by the voice-session mini-service) NEVER reaches the browser — only this
 * short-lived, scoped token does.
 *
 * Token format: `<sessionId>.<signature>` where the signature is an HMAC
 * of the sessionId + expiry using `process.env.REALTIME_TOKEN_SECRET`.
 * The mini-service validates tokens with the same secret.
 *
 * In production:
 *   - Set REALTIME_TOKEN_SECRET to a long random value (e.g. `openssl rand -hex 32`).
 *   - Set OPENAI_API_KEY / ZAI config keys ONLY on the server.
 */

const TOKEN_TTL_SECONDS = 60 * 10; // 10 minutes
const SECRET =
  process.env.REALTIME_TOKEN_SECRET ||
  // Stable dev fallback. Production MUST override this via env.
  "dev-only-realtime-token-secret-please-override-in-production";

function signToken(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

function issueToken(sessionId: string, expiresAt: number): string {
  const payload = `${sessionId}.${expiresAt}`;
  const signature = signToken(payload);
  return `${payload}.${signature}`;
}

export async function POST(request: Request) {
  // ---------------------------------------------------------------------
  // Optional auth check — in production this is where you would enforce
  // login before allowing a session. For the MVP, anonymous callers are
  // allowed; the verifyUser() stub returns null.
  // ---------------------------------------------------------------------
  const user = await verifyUser(request);

  const sessionId = randomUUID();
  const expiresAtMs = Date.now() + TOKEN_TTL_SECONDS * 1000;

  const token = issueToken(sessionId, expiresAtMs);

  // Read the currently configured voice + model from env so the client
  // can display them — but never send the API key.
  const voice = process.env.REALTIME_VOICE || "xiaochen"; // calm, professional male
  const model = process.env.REALTIME_MODEL || "gpt-4o-mini";

  const body: SessionBootstrapResponse = {
    sessionId,
    token,
    expiresAt: new Date(expiresAtMs).toISOString(),
    voice,
    model,
  };

  return NextResponse.json(body, {
    status: 200,
    headers: {
      // Tokens are short-lived but cache-no-store keeps them out of any
      // intermediate cache layer.
      "Cache-Control": "no-store",
    },
  });
}

// Force dynamic — this route must never be statically optimized.
export const dynamic = "force-dynamic";
