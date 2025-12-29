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
        'group relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-[#0F0F0F]',
        'transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-orange-500/10',
      ].join(' ')}
      aria-label={setup.setups.name}
    >
      {/* Top decorative header */}
      <div className="relative h-24 overflow-hidden bg-[#282828]">
        <PatternBackground seed={String(setup.setups.id)} />
        <div className="absolute right-3 bottom-3 flex gap-2">
          <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-black/60 px-2 py-1 backdrop-blur-md">
            <IconCode className="size-4 text-[#fabd2f]" />
            <span className="text-[10px] font-medium text-neutral-300">{editorName}</span>
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col space-y-4 p-5">
        {/* Avatar */}
        <div className="-mt-12 mb-3 size-16 overflow-hidden rounded-full border-2 border-[#0F0F0F] bg-[#282828]">
          <Avatar className="size-full rounded-full border border-neutral-700 shadow-md grayscale transition-all group-hover:grayscale-0">
            <AvatarImage
              src={userImage}
              alt={userName || userUsername || 'User avatar'}
              title={userName || userUsername || 'User avatar'}
              loading="lazy"
            />
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
        </div>

        {/* Header: title + editor name */}
        <header className="flex items-start justify-between">
          <div>
            <h2 className="font-oxanium text-lg font-medium text-neutral-200">{setup.setups.name}</h2>
            {userUsername && (
              <Link
                href={`/${userUsername}`}
                className="flex items-center gap-1"
                title="View User Profile"
                aria-label="View User Profile"
              >
                <span className="sr-only">{editorName} Setup </span>
                <h3 className="font-inter text-xs text-neutral-500">
                  by <span className="font-inter text-xs text-neutral-500 hover:text-yellow-400">@{userUsername}</span>
                </h3>
              </Link>
            )}
          </div>
          <StarButton
            setupId={setup.setups.id}
            initialIsStarred={setup.starData?.isStarred}
            initialStarCount={setup.starData?.starCount}
          />
        </header>

        {/* Setup details */}
        <section aria-label="IDE configuration details" className="space-y-2 text-xs text-neutral-400">
          {/* Theme */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${indicatorColors.theme}`} aria-hidden="true" />
              <p>Theme:</p>
            </div>
            <span className="max-w-[60%] truncate text-right text-neutral-200">{theme}</span>
          </div>

          <Separator className="h-0 border-t border-dashed border-neutral-800/50 bg-transparent" />

          {/* Font */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${indicatorColors.font}`} aria-hidden="true" />
              <p>Font:</p>
            </div>
            <span className="max-w-[60%] truncate text-right text-neutral-200">{fontFamily}</span>
          </div>

          <Separator className="h-0 border-t border-dashed border-neutral-800/50 bg-transparent" />

          {/* Font size */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${indicatorColors.fontSize}`} aria-hidden="true" />
              <p>Font Size:</p>
            </div>
            <span className="max-w-[60%] truncate text-right text-neutral-200">{fontSize}</span>
          </div>
        </section>

        <Separator className="mx-auto h-0 w-full border-t border-dashed border-neutral-800/50 bg-transparent" />

        {/* Footer */}
        <footer className="flex items-center justify-between">
          {updatedAt ? (
            <time className="text-[10px] leading-none text-green-400" dateTime={updatedAt.toISOString()}>
              Updated {updatedLabel}
            </time>
          ) : (
            <span className="text-[10px] text-neutral-600">Updated {updatedLabel}</span>
          )}

          <Link
            className="group flex items-center gap-1 text-[10px] leading-none font-medium text-orange-400 hover:text-orange-300 hover:no-underline"
            href={`/${userUsername}/${setup.setups.id}`}
            target="_self"
            title="View Configuration"
            aria-label="View Configuration"
          >
            View <span className="sr-only">{editorName}</span> Config
            <IconArrowRight className="size-3" />
          </Link>
        </footer>
      </div>
    </article>
  );
};

PublicSetupCard.displayName = 'PublicSetupCard';

export { PublicSetupCard };
