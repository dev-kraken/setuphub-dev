import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { getCurrentUser } from '@/features/auth';
import { ExtensionTokenCard, UserProfileCard } from '@/features/dashboard';
import { getUserProfile } from '@/features/dashboard/actions/update-profile';
import { ExtensionTokenCardSkeleton, UserSetupsSkeleton } from '@/features/dashboard/components/skeletons';
import { UserSetupsLoader } from '@/features/dashboard/components/user-setups-loader';
import { siteConfig } from '@/lib/constants';
import { constructMetadata } from '@/lib/metadata';

export const metadata = constructMetadata(siteConfig, {
  title: 'Dashboard',
  description:
    'Control your SetupHub dashboard with ease. Manage access tokens, sync settings, and keep your IDE setup up to date and shareable worldwide.',
  noIndex: true,
  canonical: '/dashboard',
});

export default async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) {
    return redirect('/');
  }

  // Fetch user profile data
  const profileResponse = await getUserProfile();
  const profile = profileResponse.success ? profileResponse.data : null;

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-5">
      <div>
        <h1 className="font-oxanium text-3xl font-semibold">Dashboard</h1>
        <p className="text-gray-500">Manage your access tokens and sync preferences directly from here.</p>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <UserProfileCard user={user} profile={profile} />
        <Suspense fallback={<ExtensionTokenCardSkeleton />}>
          <ExtensionTokenCard />
        </Suspense>
      </div>
      <Suspense fallback={<UserSetupsSkeleton />}>
        <UserSetupsLoader />
      </Suspense>
    </main>
  );
}
