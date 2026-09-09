/**
 * Renders one JSON-LD block.
 *
 * Payloads are built from our own constants and CMS copy, never from visitor
 * input, so serialising them directly is safe. Validate changes with Google's
 * Rich Results Test rather than trusting the shape by eye.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
