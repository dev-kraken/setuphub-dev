import { EnvValidationError } from './error';
import { type ClientSchema, clientSchema } from './schemas';

/**
 * Client environment type with computed helpers
 */
export type ClientEnv = ClientSchema & {
  readonly isDev: boolean;
  readonly isProd: boolean;
  readonly isTest: boolean;
};

// ============================================================================
// Singleton Instance
// ============================================================================

let cachedEnv: ClientEnv | null = null;

/**
 * Client environment variables
 *
 * IMPORTANT: When adding new client env vars to the schema,
 * also add them here. Next.js only bundles explicitly referenced
 * NEXT_PUBLIC_* variables into the client bundle.
 */
const clientEnvVars = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
} as const;

/**
 * Parse and validate client environment variables
 */
function parseClientEnv(): ClientEnv {
  const result = clientSchema.safeParse(clientEnvVars);

  if (!result.success) {
    throw new EnvValidationError('Client', result.error);
  }

  const data = result.data;

  return {
    ...data,
    isDev: data.NODE_ENV === 'development',
    isProd: data.NODE_ENV === 'production',
    isTest: data.NODE_ENV === 'test',
  };
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Get validated client environment variables
 * Safe to use on both server and client
 *
 * @throws {EnvValidationError} If validation fails
 *
 * @example
 * ```ts
 * // In any component
 * const env = getClientEnv();
 * console.log(env.NEXT_PUBLIC_APP_URL);
 * ```
 */
export function getClientEnv(): ClientEnv {
  if (!cachedEnv) {
    cachedEnv = parseClientEnv();
  }

  return cachedEnv;
}

// Re-export types
export type { ClientSchema } from './schemas';
