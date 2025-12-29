import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/components/shared/json-ld';
import { PublicSetupCard } from '@/components/shared/public-setup-card';
import { Separator } from '@/components/ui/separator';
import {
  EmptyUserSetupCard,
  getSetupsByUsername,
  getUserByUsername,
  getUserStats,
  UserInfo,
} from '@/features/user-profile';
import { siteConfig } from '@/lib/constants';
import { constructMetadata, generatePersonSchema, generateWebPageSchema } from '@/lib/metadata';
import { truncateTextForDescriptionSEO } from '@/lib/utils';

type PageProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const profileUser = await getUserByUsername(username);

  if (!profileUser) {
    return constructMetadata(siteConfig, {
      title: 'User Not Found',
      description: 'The user profile you are looking for does not exist.',
      noIndex: true,
    });
  }

  const stats = await getUserStats(profileUser.id);
  const description = profileUser.profile?.bio
    ? truncateTextForDescriptionSEO(profileUser.profile.bio ?? '')
    : `${profileUser.name} (@${profileUser.username}) on SetupHub. ${stats.totalSetups} setup${stats.totalSetups !== 1 ? 's' : ''} shared with the developer community.`;

  const profileUrl = `/${username}`;
  const imageUrl = `/api/og?username=${encodeURIComponent(profileUser.username)}&name=${encodeURIComponent(profileUser.name)}`;

  return constructMetadata(siteConfig, {
    title: `${profileUser.name} (@${profileUser.username})`,
    description,
    url: profileUrl,
    image: imageUrl,
    type: 'website',
    openGraph: {
      type: 'profile',
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary',
      creator: profileUser.profile?.twitterUsername ? `@${profileUser.profile.twitterUsername}` : undefined,
    },
  });
}

const Page = async ({ params }: PageProps) => {
  const { username } = await params;

  const profileUser = await getUserByUsername(username);

  if (!profileUser) {
    notFound();
  }

  const [userSetups, stats] = await Promise.all([getSetupsByUsername(username), getUserStats(profileUser.id)]);

  const profileUrl = `/${username}`;
  const imageUrl = `/api/og?username=${encodeURIComponent(profileUser.username)}&name=${encodeURIComponent(profileUser.name)}`;
  const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `${siteConfig.url}${imageUrl}`;

  return (
    <main>
      <JsonLd
        data={[
          generateWebPageSchema(siteConfig, {
            title: `${profileUser.name} (@${profileUser.username})`,
            description:
              truncateTextForDescriptionSEO(profileUser.profile?.bio ?? '') ||
              `${profileUser.name}'s profile on SetupHub`,
            url: profileUrl,
            image: absoluteImageUrl,
          }),
          generatePersonSchema(siteConfig, {
            name: profileUser.name,
            username: profileUser.username,
            image: absoluteImageUrl,
            bio: truncateTextForDescriptionSEO(profileUser.profile?.bio ?? '') || null,
            url: profileUrl,
            websiteUrl: profileUser.profile?.websiteUrl ?? null,
            twitterUsername: profileUser.profile?.twitterUsername ?? null,
            linkedinUrl: profileUser.profile?.linkedinUrl ?? null,
          }),
        ]}
      />
      <section className="mx-auto max-w-6xl space-y-6">
        <UserInfo user={profileUser} stats={stats} />
        <Separator className="w-full border-t border-dashed border-neutral-800/50 bg-transparent" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userSetups && userSetups.length > 0 ? (
            userSetups.map((setup) => <PublicSetupCard key={setup.setups.id} setup={setup} />)
          ) : (
            <div className="col-span-full">
              <EmptyUserSetupCard />
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Page;
