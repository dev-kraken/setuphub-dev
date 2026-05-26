'use client';

import { IconCheck, IconCopy, IconX } from '@tabler/icons-react';
import { type ComponentPropsWithoutRef, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const STATE_RESET_MS = 2000;

type CopyState = 'idle' | 'copied' | 'failed';

/**
 * Drop-in replacement for the `<pre>` element MDX emits for fenced code
 * blocks. Reads the rendered text out of the DOM with a ref instead of trying
 * to walk MDX's `children` tree — works regardless of whether MDX wraps the
 * source in `<code>`, applies syntax-highlight spans, or nests both.
 */
export function CodeBlock({ children, className, ...rest }: ComponentPropsWithoutRef<'pre'>) {
  const preRef = useRef<HTMLPreElement>(null);
  const [state, setState] = useState<CopyState>('idle');

  async function handleCopy() {
    const text = preRef.current?.textContent;
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setState('copied');
    } catch {
      // Permissions denied / insecure context. Surface the failure visibly so
      // the user knows to fall back to manual select — silent no-op was worse.
      setState('failed');
    } finally {
      window.setTimeout(() => setState('idle'), STATE_RESET_MS);
    }
  }

  const buttonLabel =
    state === 'copied' ? 'Copied to clipboard' : state === 'failed' ? 'Copy failed' : 'Copy code to clipboard';

  return (
    <div className="group/code relative my-6">
      <pre
        ref={preRef}
        // Announces the region to screen readers — without this, the copy
        // button has no parent context.
        role="region"
        aria-label="Code block"
        tabIndex={0}
        className={cn(
          'overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-950 p-4 pr-12 font-mono text-sm leading-relaxed text-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-700 focus-visible:outline-none',
          className,
        )}
        {...rest}
      >
        {children}
      </pre>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={handleCopy}
        aria-label={buttonLabel}
        aria-live="polite"
        // Opacity toggle lets the button fade in on hover/focus without
        // interfering with keyboard users (focus-visible reveals it too).
        className="absolute top-2 right-2 text-neutral-400 opacity-0 transition-opacity hover:text-neutral-100 focus-visible:opacity-100 group-hover/code:opacity-100"
      >
        {state === 'copied' && <IconCheck className="text-emerald-400" />}
        {state === 'failed' && <IconX className="text-rose-400" />}
        {state === 'idle' && <IconCopy />}
      </Button>
    </div>
  );
}
