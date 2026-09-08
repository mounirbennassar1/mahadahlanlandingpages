/**
 * Rotates one panel user's password and prints it once.
 *
 *   npm run admin:password                      # admin@mahadahlan.com
 *   npm run admin:password -- user@example.com  # any existing panel user
 *
 * Use this rather than `npm run db:seed`: the seed regenerates every lead
 * source's API key and can insert demo leads, which is destructive against a
 * live database. This touches a single user's password hash and nothing else.
 */
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

const DEFAULT_EMAIL = "admin@mahadahlan.com";

/** ~114 bits of entropy in four readable blocks; no lookalike characters. */
function makePassword(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = randomBytes(64);
  let out = "";
  for (let i = 0; i < 20; i++) out += alphabet[bytes[i] % alphabet.length];
  return [out.slice(0, 5), out.slice(5, 10), out.slice(10, 15), out.slice(15, 20)].join("-");
}

async function main() {
  const email = (process.argv[2] ?? DEFAULT_EMAIL).trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
    select: { name: true, role: true },
  });
  if (!user) {
    const all = await prisma.user.findMany({ select: { email: true, role: true } });
    console.error(`No panel user with the email ${email}.`);
    console.error("Existing users: " + all.map((u) => `${u.email} (${u.role})`).join(", "));
    process.exitCode = 1;
    return;
  }

  const password = makePassword();
  await prisma.user.update({
    where: { email },
    data: { passwordHash: await bcrypt.hash(password, 12) },
  });

  console.log("");
  console.log("  Panel login updated");
  console.log("  -------------------");
  console.log(`  email:    ${email}`);
  console.log(`  password: ${password}`);
  console.log(`  user:     ${user.name} (${user.role})`);
  console.log("");
  console.log("  Shown once. Save it, then set ADMIN_PASSWORD in .env.local to match");
  console.log("  so a future `npm run db:seed` cannot reset it behind your back.");
  console.log("");
}

main().finally(() => prisma.$disconnect());
