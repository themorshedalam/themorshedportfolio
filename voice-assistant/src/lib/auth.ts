/**
 * Authentication scaffolding for the voice assistant.
 *
 * The PRD requires the architecture to be "authentication-ready" without
 * mandating a specific auth provider. This module is the single place to
 * wire in real authentication (NextAuth, JWT, your own OAuth, etc.).
 *
 * For the MVP, authentication is OFF and any caller can mint a session.
 * Production deployments MUST replace `verifyUser` with a real check.
 */

export interface AuthenticatedUser {
  /** Stable user identifier */
  id: string;
  /** Human-readable display name */
  name?: string;
  /** Scopes / permissions for tool authorization */
  scopes?: string[];
}

/**
 * Verify the current request's user.
 *
 * TODO: Replace this stub with a real implementation (NextAuth session
 * lookup, JWT verification, etc.). Returning `null` means "anonymous" —
 * the session is still allowed but tools requiring a logged-in user
 * will refuse to execute.
 */
export async function verifyUser(
  _request: Request,
): Promise<AuthenticatedUser | null> {
  // Stub: no authentication is enforced in the MVP.
  // In production, this is where you would:
  //   1. Read the session cookie / Authorization header from `request`.
  //   2. Validate it against your auth provider (NextAuth, Firebase, etc.).
  //   3. Return the authenticated user, or `null` if anonymous.
  return null;
}

/**
 * Authorize a tool call for the given user.
 *
 * Tools declare the scope they require; this function checks the user
 * actually has that scope. Anonymous users can only run tools whose
 * `requiredScope` is undefined.
 *
 * @param user   The authenticated user (or null)
 * @param scope  The scope the tool requires (or undefined for any-caller)
 * @returns      `true` if the call is authorized, `false` otherwise
 */
export function authorizeTool(
  user: AuthenticatedUser | null,
  scope: string | undefined,
): boolean {
  // No scope required → any caller (including anonymous) is allowed.
  if (!scope) return true;
  // Scope required but user not authenticated → deny.
  if (!user) return false;
  // Scope required and user authenticated → check membership.
  return user.scopes?.includes(scope) ?? false;
}
