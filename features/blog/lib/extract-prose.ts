/**
 * Strips MDX syntax down to plain prose. Used for `wordCount`, `articleBody`,
 * and reading-time estimates — anywhere we need a fair, layout-agnostic word
 * stream out of the source file.
 *
 * The order matters: JSX must be removed before backtick code so `<code>`
 * blocks emitted by JSX components don't get treated as Markdown spans, and
 * front-matter-style `export` blocks must be removed first so we don't accidentally
 * keep their values in the body text.
 */
export function extractProse(source: string): string {
  return source
    // Drop the `export const meta = { ... }` / other top-level exports.
    .replace(/^export\s+(?:const|let|var|default|function|class)[\s\S]*?(?=\n\n|\n(?=#)|\n$)/gm, '')
    // Drop imports.
    .replace(/^import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '')
    // Drop fenced code blocks (``` or ~~~).
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '')
    // Drop inline code spans.
    .replace(/`[^`\n]*`/g, '')
    // Drop self-closing JSX <Foo ... /> and paired <Foo>...</Foo>.
    .replace(/<[A-Za-z][^>]*\/>/g, ' ')
    .replace(/<\/?[A-Za-z][^>]*>/g, ' ')
    // Drop image/link syntax but keep the visible text.
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    // Strip emphasis markers (* _ ~) and heading hashes.
    .replace(/[*_~]+/g, '')
    .replace(/^\s*#{1,6}\s+/gm, '')
    // Collapse whitespace.
    .replace(/\s+/g, ' ')
    .trim();
}

export function countWords(prose: string): number {
  if (!prose) return 0;
  return prose.split(/\s+/).filter(Boolean).length;
}
