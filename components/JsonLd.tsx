/**
 * Emits one or more schema.org graphs as a JSON-LD script tag.
 *
 * Server-rendered, so the markup is in the HTML crawlers receive rather than
 * being injected after hydration.
 */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
