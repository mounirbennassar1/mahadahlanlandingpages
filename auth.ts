import NextAuth, { CredentialsSignin, type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      avatarHue: number;
    } & DefaultSession["user"];
  }
}

/** Shown on the login form instead of "Invalid email or password". */
export class InactiveAccountError extends CredentialsSignin {
  code = "inactive";
}

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (raw) => {
        const parsed = CredentialsSchema.safeParse(raw);
        if (!parsed.success) {
          console.warn("[auth] credentials failed zod validation");
          return null;
        }
        const { email, password } = parsed.data;

        const user = await prisma.user.findFirst({
          where: { email: { equals: email.trim(), mode: "insensitive" } },
        });
        if (!user) {
          console.warn(`[auth] no user found for email: ${email}`);
          return null;
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
          console.warn(`[auth] bad password for: ${email}`);
          return null;
        }
        if (!user.active) {
          console.warn(`[auth] deactivated account: ${email}`);
          throw new InactiveAccountError();
        }

        await prisma.user
          .update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
          .catch((err) => console.error("[auth] lastLoginAt", err));

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatarHue: user.avatarHue,
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as { id?: string; role: UserRole; avatarHue: number };
        (token as Record<string, unknown>).id = u.id;
        (token as Record<string, unknown>).role = u.role;
        (token as Record<string, unknown>).avatarHue = u.avatarHue;
      }
      return token;
    },
    session: ({ session, token }) => {
      const t = token as Record<string, unknown>;
      if (typeof t.id === "string") session.user.id = t.id;
      if (typeof t.role === "string") session.user.role = t.role as UserRole;
      if (typeof t.avatarHue === "number") session.user.avatarHue = t.avatarHue;
      return session;
    },
  },
});
