import { requireActionMember } from "@/lib/team/member";

/** Signed-in, active member, or an `ActionError` the form can display. */
export async function requireSession() {
  return requireActionMember();
}

/** Member whose role grants `content.edit`, or an `ActionError` the form can display. */
export async function requireEditor() {
  return requireActionMember("content.edit");
}
