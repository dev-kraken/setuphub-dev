/**
 * Authentication and user-related types
 */

/**
 * User profile information returned from the API
 */
export interface UserProfile {
  /** Unique user identifier */
  id: string;
  /** Username for profile URLs and display */
  username: string;
  /** User's display name */
  name: string;
  /** User's email (optional) */
  email?: string | null;
  /** Avatar URL (optional) */
  avatarUrl?: string;
}
