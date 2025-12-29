'use server';

import { and, eq, inArray } from 'drizzle-orm';

import { getCurrentUser } from '@/features/auth';
import { db } from '@/lib/db';
import { setups, setupStars, user, userProfile } from '@/lib/db/schema';
import { type SetupWithUser } from '@/types/setup';

// ============================================================================
// Types
// ============================================================================

export interface UserProfileExtended {
  bio: string | null;
  websiteUrl: string | null;
  twitterUsername: string | null;
  linkedinUrl: string | null;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  image: string | null;
  createdAt: Date;
  profile: UserProfileExtended | null;
}

// ============================================================================
// Actions
// ============================================================================

/**
 * Fetches a user profile by username.
 * Returns null if user is not found.
 * Includes extended profile data (bio, social links).
 *
 * @param username - The username to look up
 * @returns User profile or null
 */
export async function getUserByUsername(username: string): Promise<UserProfile | null> {
  try {
    const foundUser = await db.query.user.findFirst({
      where: eq(user.username, username),
      columns: {
        id: true,
        name: true,
        username: true,
        image: true,
        createdAt: true,
      },
    });

    if (!foundUser) {
      return null;
    }

    // Fetch extended profile data
    const profileData = await db.query.userProfile.findFirst({
      where: eq(userProfile.userId, foundUser.id),
      columns: {
        bio: true,
        websiteUrl: true,
        twitterUsername: true,
        linkedinUrl: true,
      },
    });

    return {
      ...foundUser,
      profile: profileData ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * Fetches public setups for a specific user by their username.
 * Includes star data for the currently logged in user.
 *
 * @param username - The username of the profile owner
 * @returns Array of setups with user and star data
 */
export async function getSetupsByUsername(username: string): Promise<SetupWithUser[]> {
  try {
    const currentUser = await getCurrentUser();

    // Fetch the profile user
    const profileUser = await db.query.user.findFirst({
      where: eq(user.username, username),
    });

    if (!profileUser) {
      return [];
    }

    // Fetch public setups for this user
    const userSetups = await db
      .select()
      .from(setups)
      .where(and(eq(setups.userId, profileUser.id), eq(setups.isPublic, true)))
      .innerJoin(user, eq(setups.userId, user.id));

    if (userSetups.length === 0) {
      return [];
    }

    // Check which setups the current user has starred (if logged in)
    let userStarredSet = new Set<string>();
    if (currentUser) {
      const setupIds = userSetups.map((s) => s.setups.id);
      const userStars = await db
        .select({ setupId: setupStars.setupId })
        .from(setupStars)
        .where(and(eq(setupStars.userId, currentUser.id), inArray(setupStars.setupId, setupIds)));

      userStarredSet = new Set(userStars.map((s) => s.setupId));
    }

    // Combine the data with star info
    return userSetups.map((setup) => ({
      ...setup,
      starData: {
        isStarred: userStarredSet.has(setup.setups.id),
        starCount: setup.setups.starCount,
      },
    }));
  } catch {
    return [];
  }
}
