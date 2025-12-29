import { EnvValidationError } from './error';
import { type ServerSchema, serverSchema } from './schemas';

/**
 * Server environment type with computed helpers
 */
export type ServerEnv = ServerSchema & {
  readonly isDev: boolean;
  readonly isProd: boolean;
  readonly isTest: boolean;
};

// ============================================================================
// Singleton Instance
// ============================================================================

let cachedEnv: ServerEnv | null = null;

/**
 * Parse and validate server environment variables
 */
function parseServerEnv(): ServerEnv {
  const result = serverSchema.safeParse(process.env);

  if (!result.success) {
    throw new EnvValidationError('Server', result.error);
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
 * Get validated server environment variables
 *
 * @throws {Error} If called on client-side
 * @throws {EnvValidationError} If validation fails
 */
export function getServerEnv(): ServerEnv {
  if (typeof window !== 'undefined') {
    throw new Error(
      'getServerEnv() cannot be called on the client. ' + 'Use getClientEnv() for client-safe variables.',
    );
  }

  if (!cachedEnv) {
    cachedEnv = parseServerEnv();
  }

  return cachedEnv;
}

// Re-export types
export type { ServerSchema } from './schemas';
