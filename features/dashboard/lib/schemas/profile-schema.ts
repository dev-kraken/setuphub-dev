import * as z from 'zod';

/**
 * URL validation helper - allows empty string or valid URL
 */
const optionalUrl = z
  .string()
  .trim()
  .transform((val) => (val === '' ? undefined : val))
  .pipe(z.string().url('Please enter a valid URL').optional())
  .or(z.literal(''))
  .optional();

/**
 * LinkedIn URL validation - must be a valid LinkedIn profile URL
 */
const linkedinUrl = z
  .string()
  .trim()
  .transform((val) => (val === '' ? undefined : val))
  .pipe(
    z
      .string()
      .url('Please enter a valid URL')
      .refine(
        (url) => {
          if (!url) return true;
          try {
            const parsed = new URL(url);
            return parsed.hostname === 'linkedin.com' || parsed.hostname === 'www.linkedin.com';
          } catch {
            return false;
          }
        },
        { message: 'Please enter a valid LinkedIn URL' },
      )
      .optional(),
  )
  .or(z.literal(''))
  .optional();

/**
 * Twitter/X username validation
 * - Alphanumeric and underscores only
 * - Max 15 characters (Twitter limit)
 * - No @ symbol (we'll add it in the UI)
 */
const twitterUsername = z
  .string()
  .trim()
  .transform((val) => (val === '' ? undefined : val.replace(/^@/, ''))) // Remove @ if present
  .pipe(
    z
      .string()
      .max(15, 'Twitter username must be 15 characters or less')
      .regex(/^[a-zA-Z0-9_]*$/, 'Only letters, numbers, and underscores allowed')
      .optional(),
  )
  .or(z.literal(''))
  .optional();

/**
 * Validation schema for updating user profile
 *
 * All fields are optional:
 * - bio: Free text, max 160 characters
 * - websiteUrl: Valid URL format
 * - twitterUsername: Valid Twitter username (no @)
 * - linkedinUrl: Valid LinkedIn profile URL
 */
export const updateProfileSchema = z.object({
  bio: z
    .string()
    .max(160, 'Bio must be 160 characters or less')
    .trim()
    .transform((val) => (val === '' ? undefined : val))
    .optional(),

  websiteUrl: optionalUrl,

  twitterUsername: twitterUsername,

  linkedinUrl: linkedinUrl,
});

/**
 * Type inference from Zod schema
 */
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
