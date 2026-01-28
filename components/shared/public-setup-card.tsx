'use client';

import { IconArrowRight, IconCode } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useMemo } from 'react';

import PatternBackground from '@/components/shared/pattern-background';
import StarButton from '@/components/shared/star-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { getIdeMeta } from '@/lib/config/ide-registry';
import { type SetupContent, type SetupWithUser } from '@/types/setup';

/** Tailwind background color classes for indicator dots */
const INDICATOR_COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-yellow-500',
  'bg-lime-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500',
] as const;

/**
 * Generates a deterministic index from a seed string
 */
const getColorIndex = (seed: string, offset: number = 0): number => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash + offset) % INDICATOR_COLORS.length;
};

interface PublicSetupCardProps {
  setup: SetupWithUser;
}

/**
 * PublicSetupCard - Displays a setup card with user info for public viewing.
 * Refined editorial design with improved typography, spatial composition, and visual details.
 * Used on the homepage, explore page, and user profile pages.
 */
const PublicSetupCard = ({ setup }: PublicSetupCardProps) => {
  const content: SetupContent = setup.setups.content;
  const { theme, fontFamily, fontSize } = content;

  const userName = setup.user.name || '';
  const userUsername = setup.user.username || '';
  const userImage = setup.user.image || '';

  const userInitial = userName?.trim()[0] ?? userUsername?.trim()[0] ?? '?';

  const updatedAt = setup.setups.updatedAt ? new Date(setup.setups.updatedAt) : null;

  const updatedLabel = updatedAt ? formatDistanceToNow(updatedAt, { addSuffix: true }) : 'some time ago';

  // Deterministic indicator colors based on setup ID
  const indicatorColors = useMemo(() => {
    const seed = String(setup.setups.id);
    return {
      theme: INDICATOR_COLORS[getColorIndex(seed, 0)],
      font: INDICATOR_COLORS[getColorIndex(seed, 7)],
      fontSize: INDICATOR_COLORS[getColorIndex(seed, 13)],
    };
  }, [setup.setups.id]);

  const ideMeta = getIdeMeta(setup.setups.editorName);
  const editorName = ideMeta?.label;

  return (
    <article
      className={[
        'group relative flex flex-col overflow-hidden rounded-xl border border-neutral-800/50 bg-[#0F0F0F]/50 backdrop-blur-sm',
        'transition-all duration-300 hover:border-neutral-700/50 hover:bg-[#0F0F0F]/70 hover:shadow-2xl hover:shadow-black/50',
      ].join(' ')}
      aria-label={setup.setups.name}
    >
      {/* Top decorative header */}
      <div className="relative h-28 overflow-hidden bg-neutral-900/50">
        <PatternBackground seed={String(setup.setups.id)} />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-neutral-900/20" />
        <div className="absolute right-4 bottom-4 flex gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-neutral-800/50 bg-neutral-900/90 px-3 py-1.5 shadow-lg ring-1 ring-white/5 backdrop-blur-sm">
            <IconCode className="size-3.5 shrink-0 text-yellow-400" />
            <span className="font-oxanium text-[10px] font-semibold tracking-wider text-neutral-300 uppercase">
              {editorName}
            </span>
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-6">
        {/* Avatar */}
        <div className="-mt-14 mb-4 size-16 shrink-0 overflow-hidden rounded-full border-2 border-[#0F0F0F] bg-neutral-900/50 ring-2 ring-neutral-900/50">
          <Avatar className="size-full rounded-full border border-neutral-800/50 shadow-lg grayscale transition-all group-hover:grayscale-0">
            <AvatarImage
              src={userImage}
              alt={userName || userUsername || 'User avatar'}
              title={userName || userUsername || 'User avatar'}
              loading="lazy"
            />
            <AvatarFallback className="bg-neutral-800 font-medium text-neutral-300">{userInitial}</AvatarFallback>
          </Avatar>
        </div>

        {/* Header: title + editor name */}
        <header className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="font-oxanium mb-1.5 line-clamp-2 text-lg font-semibold tracking-tight text-white">
              {setup.setups.name}
            </h2>
            {userUsername && (
              <Link
                href={`/${userUsername}`}
                className="inline-flex items-center gap-1 transition-colors hover:opacity-80"
                title="View User Profile"
                aria-label="View User Profile"
              >
                <span className="sr-only">{editorName} Setup </span>
                <span className="font-inter text-xs font-medium text-neutral-500">
                  by <span className="text-neutral-400">@{userUsername}</span>
                </span>
              </Link>
            )}
          </div>
          <div className="shrink-0">
            <StarButton
              setupId={setup.setups.id}
              initialIsStarred={setup.starData?.isStarred}
              initialStarCount={setup.starData?.starCount}
            />
          </div>
        </header>

        {/* Setup details */}
        <section aria-label="IDE configuration details" className="mb-5 space-y-3">
          {/* Theme */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${indicatorColors.theme} ring-2 ring-neutral-900/50`}
                aria-hidden="true"
              />
              <span className="font-inter text-xs font-medium text-neutral-500">Theme</span>
            </div>
            <span className="font-oxanium truncate text-right text-xs font-medium text-neutral-200">{theme}</span>
          </div>

          <Separator className="border-neutral-800/50" />

          {/* Font */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${indicatorColors.font} ring-2 ring-neutral-900/50`}
                aria-hidden="true"
              />
              <span className="font-inter text-xs font-medium text-neutral-500">Font</span>
            </div>
            <span className="font-oxanium truncate text-right text-xs font-medium text-neutral-200">{fontFamily}</span>
          </div>

          <Separator className="border-neutral-800/50" />

          {/* Font size */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${indicatorColors.fontSize} ring-2 ring-neutral-900/50`}
                aria-hidden="true"
              />
              <span className="font-inter text-xs font-medium text-neutral-500">Size</span>
            </div>
            <span className="font-oxanium truncate text-right text-xs font-medium text-neutral-200">{fontSize}</span>
          </div>
        </section>

        <Separator className="mb-4 border-neutral-800/50" />

        {/* Footer */}
        <footer className="flex items-center justify-between gap-4">
          {updatedAt ? (
            <time
              className="font-inter text-[10px] leading-none font-medium text-green-400/90"
              dateTime={updatedAt.toISOString()}
            >
              Updated {updatedLabel}
            </time>
          ) : (
            <span className="font-inter text-[10px] font-medium text-neutral-600">Updated {updatedLabel}</span>
          )}

          <Link
            className="group/link font-oxanium inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-orange-400/90 uppercase transition-all hover:text-orange-300 hover:no-underline"
            href={`/${userUsername}/${setup.setups.id}`}
            target="_self"
            title="View Configuration"
            aria-label="View Configuration"
          >
            <span>View Config</span>
            <IconArrowRight className="size-3 transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </footer>
      </div>
    </article>
  );
};

PublicSetupCard.displayName = 'PublicSetupCard';

export { PublicSetupCard };
