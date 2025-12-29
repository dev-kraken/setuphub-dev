'use client';

import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconLoader2,
  IconLogout,
  IconMoodEdit,
  IconWorld,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth/client';
import { type CurrentUser } from '@/types/user';

import { type UserProfileData } from '../types';
import { EditProfileDialog } from './edit-profile-dialog';

interface UserProfileCardProps {
  user: CurrentUser;
  profile?: UserProfileData | null;
}

const UserProfileCard = ({ user, profile }: UserProfileCardProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    startTransition(async () => {
      try {
        await signOut();
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to logout');
      }
    });
  };

  return (
    <div className="glass-card hover:glass-card-hover relative space-y-3 rounded-lg border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-18">
            <AvatarImage src={user.image || ''} alt={user.name} title={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-oxanium text-xl font-medium text-white">{user.name}</div>
            <div className="text-base text-neutral-500">@{user.username}</div>
          </div>
        </div>
        <div className="z-10 flex items-center gap-2">
          <EditProfileDialog initialProfile={profile}>
            <Button variant="outline" size="default" className="cursor-pointer">
              <IconMoodEdit className="size-5" />
              Edit Profile
            </Button>
          </EditProfileDialog>
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer rounded-md text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
            onClick={handleLogout}
            disabled={isPending}
          >
            {isPending ? <IconLoader2 className="size-5 animate-spin" /> : <IconLogout className="size-5" />}
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        {/* Bio */}
        {profile?.bio && <p className="text-sm text-neutral-400">{profile.bio}</p>}

        {/* Social Links */}
        <div className="flex w-full flex-wrap gap-2">
          {/* GitHub - always shown */}
          <a
            href={`https://github.com/${user.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link flex w-fit items-center gap-2 rounded-md border border-white/5 bg-white/5 px-3 py-1.5 text-xs font-medium text-neutral-400 transition-all hover:border-white/10 hover:text-white"
          >
            <IconBrandGithub className="size-4 transition-colors group-hover/link:text-white" />
            {user.username}
          </a>

          {/* Website */}
          {profile?.websiteUrl && (
            <a
              href={profile.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link flex w-fit items-center gap-2 rounded-md border border-white/5 bg-white/5 px-3 py-1.5 text-xs font-medium text-neutral-400 transition-all hover:border-white/10 hover:text-white"
            >
              <IconWorld className="size-4 transition-colors group-hover/link:text-white" />
              Website
            </a>
          )}

          {/* X/Twitter */}
          {profile?.twitterUsername && (
            <a
              href={`https://x.com/${profile.twitterUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link flex w-fit items-center gap-2 rounded-md border border-white/5 bg-white/5 px-3 py-1.5 text-xs font-medium text-neutral-400 transition-all hover:border-white/10 hover:text-white"
            >
              <IconBrandX className="size-4 transition-colors group-hover/link:text-white" />@{profile.twitterUsername}
            </a>
          )}

          {/* LinkedIn */}
          {profile?.linkedinUrl && (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link flex w-fit items-center gap-2 rounded-md border border-white/5 bg-white/5 px-3 py-1.5 text-xs font-medium text-neutral-400 transition-all hover:border-white/10 hover:text-white"
            >
              <IconBrandLinkedin className="size-4 transition-colors group-hover/link:text-white" />
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

UserProfileCard.displayName = 'UserProfileCard';
export { UserProfileCard };
