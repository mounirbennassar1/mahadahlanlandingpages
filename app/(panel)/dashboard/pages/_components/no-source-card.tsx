import { Card } from "@/app/(panel)/dashboard/_components/card";

/** Shown on the Overview/Leads tabs of a page that has no form yet. */
export function NoSourceCard({
  pending = false,
  sourceSlug,
}: {
  pending?: boolean;
  sourceSlug?: string;
}) {
  return (
    <Card title={pending ? "No leads yet" : "This page has no form"}>
      <div style={{ fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.7 }}>
        {pending ? (
          <>
            Nobody has submitted this page&apos;s form yet. The lead source{" "}
            <code style={{ fontFamily: "var(--font-data)" }}>{sourceSlug}</code> is created
            automatically with the first submission, and the charts here fill in from then on.
          </>
        ) : (
          <>
            Visitors contact the clinic from this page by WhatsApp or phone, so there are no form
            leads to track. You can still edit the page wording from the Content tab.
          </>
        )}
      </div>
    </Card>
  );
}
