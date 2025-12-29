import { IconBox, IconBrandGithub, IconBrandLinkedin, IconBrandX, IconStar, IconWorld } from '@tabler/icons-react';

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

const UserInfo = ({ user, stats }: UserInfoProps) => {
  const userInitial = user.name?.[0] ?? user.username?.[0] ?? '?';

  return (
    <div className="grid grid-cols-1 items-center gap-5 py-5 md:grid-cols-3">
      {/* User Profile Section */}
      <div className="col-span-2 flex flex-1 items-start gap-6">
        {/* Avatar */}
        <div className="group relative cursor-pointer">
          <div className="size-20 overflow-hidden rounded-full border-4 border-[#111] bg-neutral-800 shadow-2xl transition-transform group-hover:scale-105 md:h-28 md:w-28">
            <Avatar className="size-full object-cover">
              <AvatarImage src={user.image || ''} alt={`${user.name}'s avatar`} />
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
          </div>
          <div
            className="absolute right-2 bottom-1 h-5 w-5 rounded-full border-4 border-[#111] bg-emerald-500"
            title="Online"
            aria-label="Online status"
          />
        </div>

        {/* User Details */}
        <div className="pt-1">
          <div className="mb-1 flex items-center gap-3">
            <h1 className="font-oxanium text-2xl leading-tight font-semibold tracking-tight text-white">{user.name}</h1>
          </div>
          <h2 className="font-inter text-base leading-relaxed font-light text-neutral-300">@{user.username}</h2>

          {/* Bio */}
          {user.profile?.bio && (
            <p className="font-inter mb-3 max-w-md text-sm leading-relaxed text-neutral-400">{user.profile.bio}</p>
          )}

          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            {/* GitHub - always shown */}
            <a
              href={`https://github.com/${user.username}`}
              className="group/link flex items-center gap-1.5 rounded-md border border-white/5 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-neutral-400 transition-all hover:border-white/10 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandGithub className="size-3.5 transition-colors group-hover/link:text-white" aria-hidden="true" />
              {user.username}
            </a>

            {/* Website */}
            {user.profile?.websiteUrl && (
              <a
                href={user.profile.websiteUrl}
                className="group/link flex items-center gap-1.5 rounded-md border border-white/5 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-neutral-400 transition-all hover:border-white/10 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconWorld className="size-3.5 transition-colors group-hover/link:text-white" aria-hidden="true" />
                Website
              </a>
            )}

            {/* X/Twitter */}
            {user.profile?.twitterUsername && (
              <a
                href={`https://x.com/${user.profile.twitterUsername}`}
                className="group/link flex items-center gap-1.5 rounded-md border border-white/5 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-neutral-400 transition-all hover:border-white/10 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandX className="size-3.5 transition-colors group-hover/link:text-white" aria-hidden="true" />@
                {user.profile.twitterUsername}
              </a>
            )}

            {/* LinkedIn */}
            {user.profile?.linkedinUrl && (
              <a
                href={user.profile.linkedinUrl}
                className="group/link flex items-center gap-1.5 rounded-md border border-white/5 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-neutral-400 transition-all hover:border-white/10 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandLinkedin
                  className="size-3.5 transition-colors group-hover/link:text-white"
                  aria-hidden="true"
                />
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex w-full items-center gap-3 md:w-auto">
        {/* Setups Count */}
        <div className="group/stat min-w-[120px] flex-1 cursor-default rounded-xl border border-white/5 px-5 py-3 backdrop-blur-sm transition-colors hover:bg-white/4 md:flex-none">
          <div className="mb-1.5 flex items-center gap-2 text-neutral-500">
            <IconBox size={14} className="text-neutral-600 transition-colors group-hover/stat:text-white" />
            <span className="text-[10px] font-semibold tracking-wider uppercase">Setups</span>
          </div>
          <div className="text-2xl font-medium tracking-tight text-white transition-colors group-hover/stat:text-white">
            {formatCount(stats.totalSetups)}
          </div>
        </div>

        {/* Stars Count */}
        <div className="group/stat min-w-[120px] flex-1 cursor-default rounded-xl border border-white/5 bg-white/2 px-5 py-3 backdrop-blur-sm transition-colors hover:bg-white/4 md:flex-none">
          <div className="mb-1.5 flex items-center gap-2 text-neutral-500">
            <IconStar size={14} className="text-neutral-600 transition-colors group-hover/stat:text-yellow-400" />
            <span className="text-[10px] font-semibold tracking-wider uppercase">Stars</span>
          </div>
          <div className="text-2xl font-medium tracking-tight text-white transition-colors group-hover/stat:text-yellow-100">
            {formatCount(stats.totalStars)}
          </div>
        </div>
      </div>
    </div>
  );
};

UserInfo.displayName = 'UserInfo';

export { UserInfo };
