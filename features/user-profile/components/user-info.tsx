'use client';

import { IconBox, IconBrandGithub, IconBrandLinkedin, IconBrandX, IconStar, IconWorld } from '@tabler/icons-react';
import { motion } from 'motion/react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { type UserProfileExtended } from '../actions/get-user-profile';
import { type UserStats } from '../actions/get-user-stats';

// ============================================================================
// Types
// ============================================================================

interface UserInfoUser {
  name: string;
  username: string;
  image?: string | null;
  profile?: UserProfileExtended | null;
}

interface UserInfoProps {
  user: UserInfoUser;
  stats: UserStats;
}

// ============================================================================
// Utils
// ============================================================================

/**
 * Formats large numbers into a compact, human-readable format.
 * Examples: 1234 → "1.2k", 1500000 → "1.5M"
 */
function formatCount(count: number): string {
  if (count < 1000) return count.toString();
  if (count < 1_000_000) {
    const formatted = (count / 1000).toFixed(1);
    return `${formatted.replace(/\.0$/, '')}k`;
  }
  const formatted = (count / 1_000_000).toFixed(1);
  return `${formatted.replace(/\.0$/, '')}M`;
}

// ============================================================================
// Component
// ============================================================================

/**
 * UserInfo component displaying user profile information.
 * Refined editorial design with load animations.
 */
const UserInfo = ({ user, stats }: UserInfoProps) => {
  const userInitial = user.name?.[0] ?? user.username?.[0] ?? '?';

  return (
    <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-3">
      {/* User Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="col-span-2 flex flex-1 items-start gap-6"
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-full bg-neutral-800/50 blur-md" />
          <Avatar className="relative size-20 rounded-full border-2 border-neutral-800/50 ring-2 ring-neutral-900/50 md:size-28">
            <AvatarImage src={user.image || ''} alt={`${user.name}'s avatar`} />
            <AvatarFallback className="bg-neutral-800 text-lg text-neutral-300 md:text-2xl">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div
            className="absolute right-1 bottom-1 h-4 w-4 rounded-full border-2 border-[#0A0A0A] bg-emerald-500 md:right-2 md:bottom-2 md:h-5 md:w-5"
            title="Online"
            aria-label="Online status"
          />
        </div>

        {/* User Details */}
        <div className="min-w-0 flex-1 pt-1">
          <div className="mb-2">
            <h1 className="font-oxanium mb-1 text-2xl font-semibold tracking-tight text-white md:text-3xl">
              {user.name}
            </h1>
            <h2 className="font-inter text-sm font-medium text-neutral-400 md:text-base">@{user.username}</h2>
          </div>

          {/* Bio */}
          {user.profile?.bio && (
            <p className="font-inter mb-4 max-w-lg text-sm leading-relaxed text-neutral-400 md:text-base">
              {user.profile.bio}
            </p>
          )}

          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-2">
            {/* GitHub - always shown */}
            <a
              href={`https://github.com/${user.username}`}
              className="group/link inline-flex items-center gap-1.5 rounded-lg border border-neutral-800/50 bg-neutral-900/30 px-3 py-1.5 text-xs font-medium text-neutral-400 transition-all hover:border-neutral-700/50 hover:bg-neutral-900/50 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandGithub
                className="size-3.5 shrink-0 transition-colors group-hover/link:text-white"
                aria-hidden="true"
              />
              <span>{user.username}</span>
            </a>

            {/* Website */}
            {user.profile?.websiteUrl && (
              <a
                href={user.profile.websiteUrl}
                className="group/link inline-flex items-center gap-1.5 rounded-lg border border-neutral-800/50 bg-neutral-900/30 px-3 py-1.5 text-xs font-medium text-neutral-400 transition-all hover:border-neutral-700/50 hover:bg-neutral-900/50 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconWorld
                  className="size-3.5 shrink-0 transition-colors group-hover/link:text-white"
                  aria-hidden="true"
                />
                <span>Website</span>
              </a>
            )}

            {/* X/Twitter */}
            {user.profile?.twitterUsername && (
              <a
                href={`https://x.com/${user.profile.twitterUsername}`}
                className="group/link inline-flex items-center gap-1.5 rounded-lg border border-neutral-800/50 bg-neutral-900/30 px-3 py-1.5 text-xs font-medium text-neutral-400 transition-all hover:border-neutral-700/50 hover:bg-neutral-900/50 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandX
                  className="size-3.5 shrink-0 transition-colors group-hover/link:text-white"
                  aria-hidden="true"
                />
                <span>@{user.profile.twitterUsername}</span>
              </a>
            )}

            {/* LinkedIn */}
            {user.profile?.linkedinUrl && (
              <a
                href={user.profile.linkedinUrl}
                className="group/link inline-flex items-center gap-1.5 rounded-lg border border-neutral-800/50 bg-neutral-900/30 px-3 py-1.5 text-xs font-medium text-neutral-400 transition-all hover:border-neutral-700/50 hover:bg-neutral-900/50 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandLinkedin
                  className="size-3.5 shrink-0 transition-colors group-hover/link:text-white"
                  aria-hidden="true"
                />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex w-full gap-3 md:w-auto md:flex-col"
      >
        {/* Setups Count */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="group/stat min-w-[140px] flex-1 cursor-default rounded-xl border border-neutral-800/50 bg-neutral-900/30 p-5 backdrop-blur-sm transition-all hover:border-neutral-700/50 hover:bg-neutral-900/50 md:flex-none"
        >
          <div className="mb-2 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg border border-neutral-800/50 bg-neutral-900/50">
              <IconBox size={14} className="text-neutral-400 transition-colors group-hover/stat:text-white" />
            </div>
            <span className="font-inter text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">
              Setups
            </span>
          </div>
          <div className="font-oxanium text-2xl font-semibold tracking-tight text-white transition-colors group-hover/stat:text-white md:text-3xl">
            {formatCount(stats.totalSetups)}
          </div>
        </motion.div>

        {/* Stars Count */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="group/stat min-w-[140px] flex-1 cursor-default rounded-xl border border-neutral-800/50 bg-neutral-900/30 p-5 backdrop-blur-sm transition-all hover:border-neutral-700/50 hover:bg-neutral-900/50 md:flex-none"
        >
          <div className="mb-2 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg border border-neutral-800/50 bg-neutral-900/50">
              <IconStar size={14} className="text-neutral-400 transition-colors group-hover/stat:text-yellow-400" />
            </div>
            <span className="font-inter text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">
              Stars
            </span>
          </div>
          <div className="font-oxanium text-2xl font-semibold tracking-tight text-white transition-colors group-hover/stat:text-yellow-100 md:text-3xl">
            {formatCount(stats.totalStars)}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

UserInfo.displayName = 'UserInfo';

export { UserInfo };
