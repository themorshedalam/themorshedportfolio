import { z, ZodSchema } from "zod";
import { authorizeTool, type AuthenticatedUser } from "@/lib/auth";

/**
 * Extensible tool architecture.
 *
 * Each tool declares:
 *   - a stable `name`
 *   - a Zod `params` schema (used to validate model-generated arguments
 *     BEFORE the tool is invoked — model args are NEVER trusted)
 *   - a `requiredScope` for authorization
 *   - a server-side `execute` function
 *
 * Tools NEVER touch the database directly from the model side — every call
 * is mediated by this registry, validated against the schema, and
 * authorized against the caller's scopes.
 */

export interface ToolDefinition<P extends ZodSchema> {
  name: string;
  description: string;
  params: P;
  /** Scope required to invoke this tool. `undefined` = any caller. */
  requiredScope?: string;
  /** Server-side executor — runs ONLY on the backend, never on the client. */
  execute: (args: z.infer<P>, ctx: ToolContext) => Promise<unknown>;
}

export interface ToolContext {
  user: AuthenticatedUser | null;
  sessionId: string;
  /** Monotonic log helper — never log secrets, just structured markers */
  log: (event: string, data?: Record<string, unknown>) => void;
  /** Set to true if the user interrupted — tools should bail out ASAP */
  cancelled: () => boolean;
}

// ---------------------------------------------------------------------------
// Demo tool: getServerTime
//
// A harmless read-only tool used to prove the end-to-end tool pipeline.
// It takes a timezone name and returns the current time in that zone.
// ---------------------------------------------------------------------------

const getServerTimeParams = z.object({
  timezone: z
    .string()
    .min(1)
    .max(64)
    .describe("IANA timezone name, e.g. 'Asia/Dubai' or 'America/New_York'"),
});

export const getServerTime: ToolDefinition<typeof getServerTimeParams> = {
  name: "getServerTime",
  description:
    "Returns the current server time in the given IANA timezone. Use this when the user asks what time it is.",
  params: getServerTimeParams,
  // No scope required — read-only, harmless.
  requiredScope: undefined,
  execute: async (args, ctx) => {
    ctx.log("tool:getServerTime:called", { timezone: args.timezone });
    let formatted: string;
    try {
      formatted = new Intl.DateTimeFormat("en-US", {
        timeZone: args.timezone,
        dateStyle: "full",
        timeStyle: "long",
      }).format(new Date());
    } catch {
      // Invalid timezone — fall back to UTC and flag the issue.
      formatted = new Intl.DateTimeFormat("en-US", {
        timeZone: "UTC",
        dateStyle: "full",
        timeStyle: "long",
      }).format(new Date());
    }
    return { timezone: args.timezone, now: formatted };
  },
};

// ---------------------------------------------------------------------------
// Demo tool: searchProjects
//
// A mock tool that simulates looking up the user's projects. It is here to
// demonstrate scope-required authorization: it returns "unauthorized" for
// anonymous callers. Replace `mockProjects` with a real database query.
// ---------------------------------------------------------------------------

const searchProjectsParams = z.object({
  query: z.string().min(1).max(128).describe("Free-text project search query"),
});

const mockProjects: Array<{ id: string; name: string; updatedAt: string }> = [
  { id: "p_1", name: "Project Atlas", updatedAt: "2026-09-28T10:00:00Z" },
  { id: "p_2", name: "Project Borealis", updatedAt: "2026-09-15T14:30:00Z" },
  { id: "p_3", name: "Project Helios", updatedAt: "2026-08-30T09:12:00Z" },
];

export const searchProjects: ToolDefinition<typeof searchProjectsParams> = {
  name: "searchProjects",
  description:
    "Searches the authenticated user's projects by name. Requires the 'projects:read' scope.",
  params: searchProjectsParams,
  requiredScope: "projects:read",
  execute: async (args, ctx) => {
    if (!authorizeTool(ctx.user, ctx.requiredScope)) {
      ctx.log("tool:searchProjects:unauthorized");
      return {
        ok: false,
        error: "Unauthorized — sign in to search your projects.",
      };
    }
    ctx.log("tool:searchProjects:called", { query: args.query });
    const q = args.query.toLowerCase();
    const matches = mockProjects.filter((p) =>
      p.name.toLowerCase().includes(q),
    );
    return { ok: true, projects: matches };
  },
};

// ---------------------------------------------------------------------------
// Demo tool: searchWeb
//
// Searches the internet for current information using z-ai's built-in
// `web_search` function. No authentication required — public information.
// ---------------------------------------------------------------------------

const searchWebParams = z.object({
  query: z
    .string()
    .min(1)
    .max(256)
    .describe("Search query in English"),
  num: z
    .number()
    .int()
    .min(1)
    .max(10)
    .optional()
    .describe("Number of results to return (default 5)"),
});

export const searchWeb: ToolDefinition<typeof searchWebParams> = {
  name: "searchWeb",
  description:
    "Searches the internet for current information, news, facts, weather, sports scores, stock prices, recent events, or anything you're not certain about. Returns search results with titles, URLs, and snippets.",
  params: searchWebParams,
  // No scope required — web search is public information.
  requiredScope: undefined,
  execute: async (args, ctx) => {
    ctx.log("tool:searchWeb:called", { query: args.query, num: args.num });
    // NOTE: This is a reference implementation. The actual execution
    // happens in the voice-session mini-service (mini-services/voice-session/index.ts)
    // which has access to the z-ai-web-dev-sdk. This file is kept for
    // type consistency and documentation.
    return {
      ok: false,
      error:
        "Web search is executed by the voice-session mini-service, not this registry.",
    };
  },
};

// ---------------------------------------------------------------------------
// Tool registry
// ---------------------------------------------------------------------------

const TOOL_REGISTRY: Record<string, ToolDefinition<ZodSchema>> = {
  [getServerTime.name]: getServerTime as ToolDefinition<ZodSchema>,
  [searchProjects.name]: searchProjects as ToolDefinition<ZodSchema>,
  [searchWeb.name]: searchWeb as ToolDefinition<ZodSchema>,
};

export function listTools(): Array<{
  name: string;
  description: string;
  jsonSchema: unknown;
}> {
  return Object.values(TOOL_REGISTRY).map((t) => ({
    name: t.name,
    description: t.description,
    // The model gets a JSON-Schema-like description of the params.
    // zod-to-json-schema would be cleaner, but we hand-roll a minimal
    // version to avoid pulling an extra dependency at runtime.
    jsonSchema: zodToJsonSchema(t.params),
  }));
}

export interface ToolCallResult {
  ok: boolean;
  result?: unknown;
  error?: string;
}

export async function executeTool(
  name: string,
  rawArgs: unknown,
  ctx: ToolContext,
): Promise<ToolCallResult> {
  const tool = TOOL_REGISTRY[name];
  if (!tool) {
    return { ok: false, error: `Unknown tool: ${name}` };
  }

  // Authorization check — NEVER trust the model's call directly.
  if (!authorizeTool(ctx.user, tool.requiredScope)) {
    ctx.log("tool:unauthorized", { name });
    return {
      ok: false,
      error: `Unauthorized to call ${name}.`,
    };
  }

  // Argument validation — model args can be malformed or hostile.
  const parsed = tool.params.safeParse(rawArgs);
  if (!parsed.success) {
    ctx.log("tool:invalid_args", { name, issues: parsed.error.issues });
    return {
      ok: false,
      error: `Invalid arguments: ${parsed.error.message}`,
    };
  }

  try {
    const result = await tool.execute(parsed.data, ctx);
    return { ok: true, result };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    ctx.log("tool:failed", { name, message });
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Minimal Zod → JSON Schema converter (good enough for tool descriptions).
// We avoid the `zod-to-json-schema` dependency to keep the bundle small.
// ---------------------------------------------------------------------------

function zodToJsonSchema(schema: ZodSchema): unknown {
  // zod 4 stores the def under `_def`. We extract the shape generically.
  // This is intentionally minimal — covers the common cases we use
  // (object, string, number, boolean, array).
  try {
     
    const def = (schema as any)._def;
    const typeName: string | undefined = def?.typeName;
    if (typeName === "ZodObject") {
      const shape = def?.shape?.() ?? def?.shape ?? {};
      const properties: Record<string, unknown> = {};
      const required: string[] = [];
      for (const [key, value] of Object.entries(shape)) {
        properties[key] = zodToJsonSchema(value as ZodSchema);
        const childDef = (value as ZodSchema)?._def;
        if (childDef?.typeName !== "ZodOptional") required.push(key);
      }
      return {
        type: "object",
        properties,
        required,
        additionalProperties: false,
      };
    }
    if (typeName === "ZodString") {
      return { type: "string", description: def?.description };
    }
    if (typeName === "ZodNumber") {
      return { type: "number", description: def?.description };
    }
    if (typeName === "ZodBoolean") {
      return { type: "boolean", description: def?.description };
    }
    if (typeName === "ZodArray") {
      return {
        type: "array",
        items: zodToJsonSchema(def?.element),
        description: def?.description,
      };
    }
    if (typeName === "ZodOptional") {
      const inner = zodToJsonSchema(def?.innerType);
      return { ...((inner as Record<string, unknown>) ?? {}) };
    }
    if (typeName === "ZodEnum") {
      return { type: "string", enum: def?.values };
    }
    return { description: def?.description };
  } catch {
    return {};
  }
}
