-- Team roles, member status and the audit log.
--
-- The production database is shared with the website repo, whose schema has
-- tables this repo does not declare. NEVER run `prisma db push` from here: it
-- would offer to drop them. Apply this file instead (it is idempotent):
--
--   npx prisma db execute --file prisma/sql/2026-10-08-team-roles.sql --schema prisma/schema.prisma
--
-- Everything is additive. The website repo's schema.prisma must declare the
-- same columns and tables so a `db push` from there keeps them too.

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "active" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "jobTitle" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "teamRoleId" TEXT;

CREATE TABLE IF NOT EXISTS "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "hue" INTEGER NOT NULL DEFAULT 295,
    "system" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AuditEvent" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "targetId" TEXT,
    "targetName" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Role_name_key" ON "Role"("name");
CREATE INDEX IF NOT EXISTS "AuditEvent_createdAt_idx" ON "AuditEvent"("createdAt");
CREATE INDEX IF NOT EXISTS "User_teamRoleId_idx" ON "User"("teamRoleId");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'User_teamRoleId_fkey') THEN
    ALTER TABLE "User" ADD CONSTRAINT "User_teamRoleId_fkey"
      FOREIGN KEY ("teamRoleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AuditEvent_actorId_fkey') THEN
    ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorId_fkey"
      FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- The three system roles (same ids and permissions as SYSTEM_ROLES in
-- lib/team/permissions.ts). Existing rows are left alone so edits survive.
INSERT INTO "Role" ("id", "name", "description", "permissions", "hue", "system", "updatedAt") VALUES
  ('role_admin', 'Administrator', 'Full access, including the team and roles.',
   ARRAY['leads.view_all','leads.update','leads.assign','leads.export','content.edit','marketing.manage','team.manage'], 295, true, CURRENT_TIMESTAMP),
  ('role_manager', 'Manager', 'Runs leads and the website; cannot change the team or tracking.',
   ARRAY['leads.view_all','leads.update','leads.assign','leads.export','content.edit'], 220, true, CURRENT_TIMESTAMP),
  ('role_sales', 'Sales', 'Works the lead list: status and assignment.',
   ARRAY['leads.view_all','leads.update','leads.assign'], 155, true, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Give every existing member the system role matching their current access.
UPDATE "User" SET "teamRoleId" = CASE "role"
    WHEN 'ADMIN' THEN 'role_admin'
    WHEN 'MANAGER' THEN 'role_manager'
    ELSE 'role_sales'
  END
WHERE "teamRoleId" IS NULL;
