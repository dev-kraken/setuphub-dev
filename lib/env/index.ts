/**
 * Type-safe Environment Configuration for Next.js 16+
 *
 * @module @/lib/env
 *
 * @example Server-only variables (API routes, server components)
 * ```ts
 * import { serverEnv } from "@/lib/env";
 * // Use serverEnv.COOKIE_SECRET
 * ```
 *
 * @example Client-safe variables (anywhere)
 * ```ts
 * import { clientEnv } from "@/lib/env";
 * // Use clientEnv.NEXT_PUBLIC_APP_URL
 * ```
 */

import { type ClientEnv, getClientEnv } from './client';
import { getServerEnv, type ServerEnv } from './server';

// ============================================================================
// Server Environment (Private - Never expose to client)
// ============================================================================

/**
 * Server-only environment variables
 *
 * ✅ Safe to use in:
 * - Server Components
 * - API Routes / Route Handlers
 * - Middleware
 * - Server Actions
 *
 * ❌ NEVER use in:
 * - Client Components ("use client")
 * - Browser code
 */
export const serverEnv: ServerEnv = new Proxy({} as ServerEnv, {
  get(_, prop: string) {
    if (typeof window !== 'undefined') {
      throw new Error(
        `🚨 Security Error: Cannot access server variable "${prop}" on client.\n` +
          'Server variables contain sensitive data and must never be exposed to the browser.',
      );
    }
    return getServerEnv()[prop as keyof ServerEnv];
  },
});

// ============================================================================
// Client Environment (Public - Safe for browser)
// ============================================================================

/**
 * Client-safe environment variables
 * Safe to use anywhere in your application
 */
export const clientEnv: ClientEnv = new Proxy({} as ClientEnv, {
  get(_, prop: string) {
    return getClientEnv()[prop as keyof ClientEnv];
  },
});

// ============================================================================
// Re-exports
// ============================================================================

// Types
export type { ClientEnv, ClientSchema } from './client';
export type { EnvError } from './error';
export type { ServerEnv, ServerSchema } from './server';
