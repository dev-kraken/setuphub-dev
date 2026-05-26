import type { MDXComponents } from 'mdx/types';
import type { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { isValidElement, type AnchorHTMLAttributes, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { CodeBlock } from '../components/code-block';

/**
 * Walks a `ReactNode` tree and concatenates all visible text. Lets headings
 * with inline formatting (`## **Bold** title`, `## With \`code\``) still
 * generate a deep-link anchor instead of silently rendering without an `id`.
 */
function flattenText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join('');
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return flattenText(props.children);
  }
  return '';
}

function headingId(children: ReactNode): string | undefined {
  const text = flattenText(children).trim();
  if (!text) return undefined;
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>;

function MdxLink({ href, children, className, ...rest }: AnchorProps) {
  const isExternal = !!href && /^(https?:)?\/\//.test(href);
  const classes = cn(
    'text-primary underline decoration-neutral-700 underline-offset-4 transition-colors hover:decoration-primary',
    className,
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={(href ?? '#') as Route<string>} className={classes}>
      {children}
    </Link>
  );
}

interface MdxImageProps {
  src?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * MDX emits `<img>` with `src: string | undefined`. We narrow at runtime so
 * `next/image`'s stricter `src` typing doesn't need a cast — anything missing
 * a src is just dropped (better than a broken image at runtime).
 */
function MdxImage({ src, alt = '', width = 1200, height = 630 }: MdxImageProps) {
  if (!src) return null;
  const toNumber = (v: number | string) => (typeof v === 'string' ? Number.parseInt(v, 10) : v);

  return (
    <span className="my-8 block overflow-hidden rounded-lg border border-neutral-800">
      <Image
        src={src}
        alt={alt}
        width={toNumber(width)}
        height={toNumber(height)}
        sizes="(min-width: 1024px) 768px, 100vw"
        className="h-auto w-full"
      />
    </span>
  );
}

/**
 * Hero/lead image — opt-in via the `<Hero>` MDX shortcut. Marked `priority`
 * because it's intended to be the LCP element when used.
 */
export function MdxHero({ src, alt, width = 1600, height = 900 }: Required<Pick<MdxImageProps, 'src' | 'alt'>> & Partial<Pick<MdxImageProps, 'width' | 'height'>>) {
  return (
    <span className="my-8 block overflow-hidden rounded-lg border border-neutral-800">
      <Image
        src={src}
        alt={alt}
        width={typeof width === 'string' ? Number.parseInt(width, 10) : width}
        height={typeof height === 'string' ? Number.parseInt(height, 10) : height}
        sizes="(min-width: 1024px) 768px, 100vw"
        priority
        className="h-auto w-full"
      />
    </span>
  );
}

/**
 * Headings render with anchor IDs so deep links and the future TOC work
 * without an extra rehype plugin. Children flow through `flattenText` so
 * formatting inside the heading doesn't strip the slug.
 */
export const mdxComponents: MDXComponents = {
  h1: ({ children, ...rest }: ComponentPropsWithoutRef<'h1'>) => (
    <h1
      id={headingId(children)}
      className="font-oxanium mt-12 mb-6 scroll-mt-24 text-3xl font-semibold tracking-tight text-white md:text-4xl"
      {...rest}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...rest }: ComponentPropsWithoutRef<'h2'>) => (
    <h2
      id={headingId(children)}
      className="font-oxanium mt-12 mb-4 scroll-mt-24 border-b border-neutral-800 pb-2 text-2xl font-semibold tracking-tight text-white md:text-3xl"
      {...rest}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...rest }: ComponentPropsWithoutRef<'h3'>) => (
    <h3
      id={headingId(children)}
      className="font-oxanium mt-8 mb-3 scroll-mt-24 text-xl font-semibold tracking-tight text-white md:text-2xl"
      {...rest}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...rest }: ComponentPropsWithoutRef<'h4'>) => (
    <h4
      id={headingId(children)}
      className="font-oxanium mt-6 mb-2 scroll-mt-24 text-lg font-semibold tracking-tight text-neutral-100"
      {...rest}
    >
      {children}
    </h4>
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p className="font-inter my-5 text-base leading-relaxed text-neutral-300 md:text-lg" {...props} />
  ),
  a: MdxLink,
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul className="font-inter my-5 list-disc space-y-2 pl-6 text-neutral-300 marker:text-neutral-600" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol className="font-inter my-5 list-decimal space-y-2 pl-6 text-neutral-300 marker:text-neutral-600" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>) => <li className="leading-relaxed" {...props} />,
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote className="border-primary/60 my-6 border-l-2 pl-4 text-neutral-400 italic" {...props} />
  ),
  hr: (props: ComponentPropsWithoutRef<'hr'>) => <hr className="my-10 border-neutral-800" {...props} />,
  strong: (props: ComponentPropsWithoutRef<'strong'>) => (
    <strong className="font-semibold text-neutral-100" {...props} />
  ),
  em: (props: ComponentPropsWithoutRef<'em'>) => <em className="text-neutral-200 italic" {...props} />,
  code: (props: ComponentPropsWithoutRef<'code'>) => (
    <code
      className="rounded border border-neutral-800 bg-neutral-900/80 px-1.5 py-0.5 font-mono text-[0.9em] text-neutral-200"
      {...props}
    />
  ),
  pre: CodeBlock,
  table: (props: ComponentPropsWithoutRef<'table'>) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-neutral-800">
      <table className="w-full border-collapse text-left text-sm text-neutral-300" {...props} />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<'th'>) => (
    <th className="font-oxanium border-b border-neutral-800 bg-neutral-900/50 px-4 py-2 text-neutral-100" {...props} />
  ),
  td: (props: ComponentPropsWithoutRef<'td'>) => (
    <td className="border-b border-neutral-800/60 px-4 py-2" {...props} />
  ),
  img: MdxImage,
  // Author-facing shortcut: `<Hero src="..." alt="..." />` at the top of a post.
  Hero: MdxHero,
};
