import { type personalAccessTokens, type setups, type userProfile } from '@/lib/db/schema';

/**
 * Dashboard Feature Types
 */

// Token Types
export interface CreateTokenResponse {
  success: boolean;
  /** The DB record (with hashed token) */
  data?: typeof personalAccessTokens.$inferInsert | null;
  /** Plain text token - shown to user ONCE on creation */
  plainToken?: string;
  error?: string;
}

export interface GetTokenResponse {
  success: boolean;
  data?: (typeof personalAccessTokens.$inferSelect)[] | null;
  error?: string;
}

// Setup Types
export interface UserSetupWithStars extends Omit<typeof setups.$inferSelect, never> {
  user: {
    username: string;
  };
  starData: {
    isStarred: boolean;
    starCount: number;
  };
}

export interface GetUserSetupsResponse {
  success: boolean;
  data?: UserSetupWithStars[] | null;
  error?: string;
}

// Profile Types
export type UserProfileData = typeof userProfile.$inferSelect;

export interface UpdateProfileResponse {
  success: boolean;
  data?: UserProfileData | null;
  error?: string;
}

export interface GetProfileResponse {
  success: boolean;
  data?: UserProfileData | null;
  error?: string;
}
