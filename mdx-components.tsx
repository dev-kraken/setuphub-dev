import type { MDXComponents } from 'mdx/types';

import { mdxComponents } from '@/features/blog/lib/mdx-components';

/**
 * Required by `@next/mdx`. Next.js looks up this file at the project root
 * during MDX compilation. Real component mapping lives in the blog feature
 * so the styling stays co-located with the rest of the blog code.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...mdxComponents,
  };
}
