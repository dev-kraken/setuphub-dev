// Cached at module scope — `Intl.DateTimeFormat` is non-trivial to construct.
// `medium` style renders as "May 20, 2026" in en-US, matching the prior date-fns output.
const postDateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });

export function formatPostDate(iso: string): string {
  return postDateFormatter.format(new Date(iso));
}
