import { auth } from "@/auth";
import type { UserRole } from "@prisma/client";
import { ActionError } from "./action";

/** ADMIN and MANAGER may create/update/delete website content; AGENT is read-only. */
export function isEditor(role: UserRole | string | null | undefined) {
  return role === "ADMIN" || role === "MANAGER";
}

export async function requireSession() {
  const session = await auth();
  if (!session?.user) throw new ActionError("Your session has expired. Please sign in again.");
  return session;
}

/** Session + editor role, or an `ActionError` the form can display. */
export async function requireEditor() {
  const session = await requireSession();
  if (!isEditor(session.user.role)) {
    throw new ActionError("You don't have permission to edit website content.");
  }
  return session;
}
