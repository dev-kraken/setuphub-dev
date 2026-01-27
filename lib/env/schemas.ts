import { z } from 'zod';

/**
 * Type-safe environment variable schemas for Next.js 16+
 *
 * @see https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
 */

// ============================================================================
// Common Validators (Zod 4 API)
// ============================================================================

const nodeEnv = z.enum(['development', 'production', 'test'], {
  error: "NODE_ENV must be 'development', 'production', or 'test'",
});

const requiredString = (name: string) =>
  z.string({ error: `${name} is required` }).min(1, { error: `${name} cannot be empty` });

const requiredUrl = (name: string) => z.url({ error: `${name} must be a valid URL` });

const requiredSecret = (name: string, minLength = 32) =>
  z.string({ error: `${name} is required` }).min(minLength, {
    error: `${name} must be at least ${minLength} characters`,
  });

const optionalPort = z.coerce
  .number({ error: 'PORT must be a number' })
  .int({ error: 'PORT must be an integer' })
  .positive({ error: 'PORT must be positive' })
  .max(65535, { error: 'PORT must be less than 65536' })
  .optional();

// ============================================================================
// Server Schema (Private - Never exposed to client)
// ============================================================================

export const serverSchema = z.object({
  NODE_ENV: nodeEnv,
  PORT: optionalPort,
  BETTER_AUTH_SECRET: requiredSecret('BETTER_AUTH_SECRET', 32),
  BETTER_AUTH_URL: requiredUrl('BETTER_AUTH_URL'),
  GITHUB_CLIENT_ID: requiredString('GITHUB_CLIENT_ID'),
  GITHUB_CLIENT_SECRET: requiredString('GITHUB_CLIENT_SECRET'),
  DATABASE_URL: requiredUrl('DATABASE_URL'),
  GOOGLE_FONTS_API_KEY: requiredString('GOOGLE_FONTS_API_KEY'),
});

// ============================================================================
// Client Schema (Public - Safe for browser)
// ============================================================================

export const clientSchema = z.object({
  NODE_ENV: nodeEnv,
  NEXT_PUBLIC_APP_URL: requiredUrl('NEXT_PUBLIC_APP_URL'),
});

// ============================================================================
// Type Exports
// ============================================================================

export type ServerSchema = z.infer<typeof serverSchema>;
export type ClientSchema = z.infer<typeof clientSchema>;
