/**
 * Guards the page-content registry.
 *
 * Run with `npm run check:content`. For every registered page it asserts that
 *
 *   1. the copy shipped in `content.ts` passes the page's own zod schema, so an
 *      admin can always save a page they have not edited, and
 *   2. saving those untouched defaults stores nothing, so a later copy change in
 *      code still reaches pages nobody has customised.
 *
 * Both failures are silent in normal use, which is why they are checked here.
 */
import { PAGES } from "@/lib/pages/registry";
import { allFields } from "@/lib/pages/define";
import { buildContentSchema } from "@/lib/pages/schema";
import { diffContent } from "@/lib/pages/merge";

let failures = 0;

for (const def of PAGES) {
  const payload: Record<string, unknown> = {};
  for (const [key, field] of allFields(def)) payload[key] = structuredClone(field.default);

  const parsed = buildContentSchema(def).safeParse(payload);
  if (!parsed.success) {
    failures++;
    console.error(`✗ ${def.slug}: the copy in content.ts fails its own schema`);
    for (const issue of parsed.error.issues.slice(0, 5)) {
      console.error(`    ${issue.path.join(".")}: ${issue.message}`);
    }
    continue;
  }

  const diff = diffContent(def, parsed.data);
  if (Object.keys(diff).length > 0) {
    failures++;
    console.error(
      `✗ ${def.slug}: saving unedited defaults would store ${Object.keys(diff).join(", ")}`,
    );
  }
}

if (failures > 0) {
  console.error(`\n${failures} of ${PAGES.length} pages have problems.`);
  process.exit(1);
}

console.log(`✓ ${PAGES.length} pages: defaults validate and round-trip cleanly.`);
