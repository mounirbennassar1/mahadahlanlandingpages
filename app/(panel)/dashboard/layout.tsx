import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { getMember } from "@/lib/team/member";
import { Sidebar } from "./_components/sidebar";
import { Topbar } from "./_components/topbar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  // Deactivated or removed while still holding a valid session cookie.
  const member = await getMember();
  if (!member) redirect("/logout");

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <div
      className="app"
      style={{
        display: "grid",
        gridTemplateColumns: "var(--sidebar-w) 1fr",
        minHeight: "100vh",
        background: "var(--bg)",
      }}
    >
      <Sidebar
        user={{ name: member.name, avatarHue: member.avatarHue, roleName: member.roleName }}
        permissions={member.permissions}
        signOutAction={handleSignOut}
      />
      <main style={{ minWidth: 0 }}>
        <Topbar user={session.user} />
        <div style={{ padding: "8px 32px 48px" }}>{children}</div>
      </main>
    </div>
  );
}
