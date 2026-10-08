import { signOut } from "@/auth";

/**
 * Ends the session of a member who was deactivated or removed while signed in.
 * The dashboard layout redirects here because a server component cannot clear
 * the session cookie itself.
 */
export async function GET() {
  await signOut({ redirectTo: "/login?error=Your%20access%20has%20changed.%20Please%20sign%20in%20again." });
}
