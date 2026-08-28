import { Prisma } from "@prisma/client";
import { z } from "zod";

/**
 * Shared shape returned by every content server action so forms can use
 * `useActionState` uniformly: `{ ok, error?, fieldErrors? }`.
 */
export type ActionState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export const initialActionState: ActionState = { ok: false };

/** Thrown inside `guard()` to short-circuit with a friendly, safe message. */
export class ActionError extends Error {
  fieldErrors?: Record<string, string>;
  constructor(message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "ActionError";
    this.fieldErrors = fieldErrors;
  }
}

/** First message per field from a zod error (zod 4 issue paths). */
export function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.length ? String(issue.path[0]) : "_form";
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

export type GuardResult<T> = { ok: true; data: T } | { ok: false; state: ActionState };

/**
 * Runs an action body and converts known failures into an `ActionState`
 * without ever leaking stack traces. `redirect()` must be called by the
 * caller *after* `guard()` returns, never inside it.
 */
export async function guard<T>(fn: () => Promise<T>): Promise<GuardResult<T>> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (err) {
    if (err instanceof ActionError) {
      return { ok: false, state: { ok: false, error: err.message, fieldErrors: err.fieldErrors } };
    }
    if (err instanceof z.ZodError) {
      return {
        ok: false,
        state: { ok: false, error: "Please fix the highlighted fields.", fieldErrors: zodFieldErrors(err) },
      };
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        const target = Array.isArray(err.meta?.target) ? (err.meta?.target as string[]) : [];
        const field = target.includes("slug") || target.length === 0 ? "slug" : target[0];
        return {
          ok: false,
          state: {
            ok: false,
            error: "That value is already in use.",
            fieldErrors: { [field]: field === "slug" ? "This slug is already taken." : "Already in use." },
          },
        };
      }
      if (err.code === "P2025") {
        return { ok: false, state: { ok: false, error: "This record no longer exists." } };
      }
    }
    console.error("[admin action]", err);
    return { ok: false, state: { ok: false, error: "Something went wrong. Please try again." } };
  }
}
