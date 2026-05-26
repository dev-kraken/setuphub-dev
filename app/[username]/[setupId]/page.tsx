import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/components/shared/json-ld';
import { getSetupById } from '@/features/setup-detail';
import { SetupDetailPage } from '@/features/setup-detail';
import { getIdeMeta } from '@/lib/config/ide-registry';
import { siteConfig } from '@/lib/constants';
import {
  constructMetadata,
  generateBreadcrumbSchema,
  generateSetupSchema,
  generateWebPageSchema,
} from '@/lib/metadata';
import { truncateTextForDescriptionSEO } from '@/lib/utils';

type PageProps = {
  params: Promise<{ username: string; setupId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username, setupId } = await params;
  const setup = await getSetupById(setupId);

  if (!setup || setup.user.username !== username) {
    return constructMetadata(siteConfig, {
      title: 'Setup Not Found',
      description: 'The setup you are looking for does not exist or is not publicly available.',
      noIndex: true,
    });
  }

  const ideMeta = getIdeMeta(setup.setups.editorName);
  const setupName = setup.setups.name;
  const description =
    truncateTextForDescriptionSEO(setup.setups.description ?? '') ||
    `${setupName} - ${ideMeta.label} configuration shared by ${setup.user.name} on SetupHub. Star this setup to help others find it.`;

  const setupUrl = `/${username}/${setupId}`;
  const ogImageUrl = `/api/og?username=${encodeURIComponent(setup.user.username)}&ide=${encodeURIComponent(ideMeta.label)}&name=${encodeURIComponent(setupName)}`;

  return constructMetadata(siteConfig, {
    title: `${setupName} by ${setup.user.name}`,
    description,
    url: setupUrl,
    image: {
      url: ogImageUrl,
      width: 1200,
      height: 630,
      alt: `${setupName} — ${ideMeta.label} setup by ${setup.user.name} on SetupHub`,
    },
    type: 'website',
    keywords: [
      ...siteConfig.keywords,
      ideMeta.label.toLowerCase(),
      setup.setups.editorName,
      setup.user.username,
      'ide setup',
      'code editor configuration',
    ],
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
    },
  });
}

export default async function Page({ params }: PageProps) {
  const { username, setupId } = await params;
  const setup = await getSetupById(setupId);

  if (!setup || setup.user.username !== username) {
    notFound();
  }

  const ideMeta = getIdeMeta(setup.setups.editorName);
  const setupUrl = `/${username}/${setupId}`;
  const authorUrl = `/${username}`;

  const setupName = setup.setups.name;
  const description =
    truncateTextForDescriptionSEO(setup.setups.description ?? '') ||
    `${setupName} - ${ideMeta.label} configuration shared by ${setup.user.name} on SetupHub.`;

  // Use the dynamic OG image (1200×630) as the canonical visual for both the
  // page and the CreativeWork — the IDE icon is brand art, not setup imagery.
  const ogImageUrl = `${siteConfig.url}/api/og?username=${encodeURIComponent(setup.user.username)}&ide=${encodeURIComponent(ideMeta.label)}&name=${encodeURIComponent(setupName)}`;

  return (
    <main className="relative min-h-screen w-full">
      {/* Background atmosphere */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <JsonLd
        data={[
          generateBreadcrumbSchema(siteConfig, [
            { name: 'Home', url: '/' },
            { name: setup.user.name, url: authorUrl },
            { name: setupName, url: setupUrl },
          ]),
          generateWebPageSchema(siteConfig, {
            title: `${setupName} by ${setup.user.name}`,
            description,
            url: setupUrl,
            image: ogImageUrl,
            publishedTime: setup.setups.createdAt.toISOString(),
            modifiedTime: setup.setups.updatedAt.toISOString(),
          }),
          generateSetupSchema(siteConfig, {
            name: setupName,
            description: truncateTextForDescriptionSEO(setup.setups.description ?? ''),
            url: setupUrl,
            authorName: setup.user.name,
            authorUrl,
            authorUsername: setup.user.username,
            editorName: setup.setups.editorName,
            editorLabel: ideMeta.label,
            createdAt: setup.setups.createdAt.toISOString(),
            updatedAt: setup.setups.updatedAt.toISOString(),
            image: ogImageUrl,
            starCount: setup.starData?.starCount,
          }),
        ]}
      />
      <SetupDetailPage username={username} setupId={setupId} />
    </main>
  );
}
