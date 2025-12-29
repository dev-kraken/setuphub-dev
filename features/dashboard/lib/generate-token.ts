import crypto from 'crypto';

/**
 * Generates a secure random token for API authentication.
 * Returns the plain text token that should be shown to the user ONCE.
 */
export const generateToken = (): string => {
  const randomBytes = crypto.randomBytes(32).toString('hex');
  return `setuphub_pat_${randomBytes}`;
};

/**
 * Hashes a token using SHA-256 for secure storage.
 * The hashed version is stored in the database.
 */
export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
