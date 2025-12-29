'use server';

import { and, eq } from 'drizzle-orm';

import { getCurrentUser } from '@/features/auth';
import { db } from '@/lib/db';
import { setups, setupStars, user } from '@/lib/db/schema';
import { type SetupWithUser } from '@/types/setup';

/**
 * Fetches a single setup by ID (UUID) with user info and star data.
 * Uses denormalized starCount for performance (no COUNT queries).
 */
export const getSetupById = async (id: string): Promise<SetupWithUser | null> => {
  const currentUser = await getCurrentUser();

  // Fetch setup with user info
  const [setup] = await db
    .select()
    .from(setups)
    .where(and(eq(setups.id, id), eq(setups.isPublic, true)))
    .innerJoin(user, eq(setups.userId, user.id))
    .limit(1);

  if (!setup) {
    return null;
  }

  // Check if current user has starred this setup
  let isStarred = false;
  if (currentUser) {
    const existingStar = await db.query.setupStars.findFirst({
      where: and(eq(setupStars.userId, currentUser.id), eq(setupStars.setupId, id)),
    });
    isStarred = !!existingStar;
  }

  return {
    ...setup,
    starData: {
      isStarred,
      starCount: setup.setups.starCount, // ← No COUNT query needed!
    },
  };
};
