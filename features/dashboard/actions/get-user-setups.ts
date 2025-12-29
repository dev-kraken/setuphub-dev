'use server';

import { and, eq, inArray } from 'drizzle-orm';

import { getCurrentUser } from '@/features/auth';
import { db } from '@/lib/db';
import { setups, setupStars } from '@/lib/db/schema';

import { type GetUserSetupsResponse } from '../types';

/**
 * Fetches user's own setups with star data.
 * Uses denormalized starCount for performance (no COUNT queries).
 */
export const getUserSetups = async (): Promise<GetUserSetupsResponse> => {
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    return {
      success: false,
      data: [],
      error: 'Unauthorized',
    };
  }

  const userId = sessionUser.id;

  // Fetch user's setups (starCount is already in the table!)
  const userSetups = await db.query.setups.findMany({
    where: eq(setups.userId, userId),
  });

  if (userSetups.length === 0) {
    return {
      success: true,
      data: [],
    };
  }

  const setupIds = userSetups.map((s) => s.id);

  // Check which setups the current user has starred
  const userStars = await db
    .select({ setupId: setupStars.setupId })
    .from(setupStars)
    .where(and(eq(setupStars.userId, userId), inArray(setupStars.setupId, setupIds)));

  const userStarredSet = new Set(userStars.map((s) => s.setupId));

  // Combine setups with star data - starCount from denormalized column
  const setupsWithStars = userSetups.map((setup) => ({
    ...setup,
    user: {
      username: sessionUser.username,
    },
    starData: {
      isStarred: userStarredSet.has(setup.id),
      starCount: setup.starCount, // ← No COUNT query needed!
    },
  }));

  return {
    success: true,
    data: setupsWithStars,
  };
};
