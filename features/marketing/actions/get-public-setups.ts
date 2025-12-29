'use server';

import { and, desc, eq, inArray } from 'drizzle-orm';

import { getCurrentUser } from '@/features/auth';
import { db } from '@/lib/db';
import { setups, setupStars, user } from '@/lib/db/schema';
import { type SetupWithUser } from '@/types/setup';

/**
 * Fetches public setups with user info and star data.
 * Uses denormalized starCount for performance (no COUNT queries).
 */
export const getPublicSetups = async (): Promise<SetupWithUser[]> => {
  const currentUser = await getCurrentUser();

  // Fetch public setups with user info
  const publicSetups = await db
    .select()
    .from(setups)
    .where(eq(setups.isPublic, true))
    .innerJoin(user, eq(setups.userId, user.id))
    .orderBy(desc(setups.starCount))
    .limit(6);

  if (publicSetups.length === 0) {
    return [];
  }

  // Check which setups the current user has starred (if logged in)
  let userStarredSet = new Set<string>();
  if (currentUser) {
    const setupIds = publicSetups.map((s) => s.setups.id);
    const userStars = await db
      .select({ setupId: setupStars.setupId })
      .from(setupStars)
      .where(and(eq(setupStars.userId, currentUser.id), inArray(setupStars.setupId, setupIds)));

    userStarredSet = new Set(userStars.map((s) => s.setupId));
  }

  // Combine the data - starCount comes from denormalized column
  return publicSetups.map((setup) => ({
    ...setup,
    starData: {
      isStarred: userStarredSet.has(setup.setups.id),
      starCount: setup.setups.starCount, // ← No COUNT query needed!
    },
  }));
};
