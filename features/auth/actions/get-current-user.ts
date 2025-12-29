'use server';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth/config';
import { type CurrentUser } from '@/types/user';

/**
 * Get the currently authenticated user from the session.
 * Returns null if user is not authenticated (does not throw).
 */
export const getCurrentUser = async (): Promise<CurrentUser | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  return session.user as CurrentUser;
};
