'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { getCurrentUser } from '@/features/auth/actions/get-current-user';
import { db } from '@/lib/db';
import { setups, setupStars } from '@/lib/db/schema';

export interface DeleteUserSetupResult {
  success: boolean;
  message: string;
}

export async function deleteUserSetup(setupId: string): Promise<DeleteUserSetupResult> {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, message: 'Unauthorized' };
  }

  const setup = await db.query.setups.findFirst({
    where: eq(setups.id, setupId),
  });

  if (!setup) {
    return { success: false, message: 'Setup not found' };
  }

  if (setup.userId !== user.id) {
    return { success: false, message: 'Unauthorized' };
  }

  // Delete related stars first, then the setup
  // Note: neon-http driver doesn't support transactions
  await db.delete(setupStars).where(eq(setupStars.setupId, setupId));
  await db.delete(setups).where(eq(setups.id, setupId));

  revalidatePath('/dashboard');

  return { success: true, message: 'Setup deleted successfully' };
}
