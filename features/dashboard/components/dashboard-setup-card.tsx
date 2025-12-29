'use client';

import { IconProgressCheck } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

import StarButton from '@/components/shared/star-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SetupDeleteDialog } from '@/features/dashboard/components/setup-delete-dialog';
import { getIdeMeta } from '@/lib/config/ide-registry';
import { cn } from '@/lib/utils';

import { type UserSetupWithStars } from '../types';

interface DashboardSetupCardProps {
  setup: UserSetupWithStars;
}

/**
 * DashboardSetupCard - Displays a user's own setup card in the dashboard.
 * Shows setup details without user info (since it's the current user's setup).
 */
const DashboardSetupCard = ({ setup }: DashboardSetupCardProps) => {
  const ideMeta = getIdeMeta(setup.editorName);

  const updatedAt = new Date(setup.updatedAt);
  const extensionsCount = setup.content.extensions?.length ?? 0;

  return (
    <Card className="glass-card gap-5">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-12 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 p-1.5 text-blue-400">
            <Avatar className="size-full rounded-none">
              <AvatarImage
                src={ideMeta?.icon || ''}
                alt={`${setup.editorName} logo`}
                title={`${setup.editorName} logo`}
              />
              <AvatarFallback>{ideMeta?.label?.charAt(0) || setup.editorName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <CardTitle className="font-oxanium flex items-center gap-2 text-2xl font-semibold text-white">
              <Link href={`/${setup.user.username}/${setup.id}`} className="hover:text-yellow-500">
                {setup.name}
              </Link>
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
              <IconProgressCheck className="size-4 text-green-500" aria-hidden="true" />
              <time className="font-inter text-[10px] text-green-500" dateTime={updatedAt.toISOString()}>
                Updated {formatDistanceToNow(updatedAt, { addSuffix: true })}
              </time>
            </CardDescription>
          </div>
        </div>
        <CardAction>
          <Badge variant={setup.isPublic ? 'success' : 'warning'}>
            <span
              className={cn('size-1.5 rounded-full', setup.isPublic ? 'bg-green-500' : 'bg-amber-500')}
              aria-hidden="true"
            />
            <span className="text-xs">{setup.isPublic ? 'Public' : 'Private'}</span>
          </Badge>
        </CardAction>
      </CardHeader>

      <Separator className="w-full border-t border-dashed border-neutral-800/50 bg-transparent" />

      <CardContent className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-400">
            <span className="h-2 w-2 rounded-full bg-purple-500" aria-hidden="true" />
            <span>Theme</span>
          </div>
          <span className="font-inter text-neutral-300">{setup.content.theme}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-400">
            <span className="h-2 w-2 rounded-full bg-yellow-500" aria-hidden="true" />
            <span>Font</span>
          </div>
          <span className="font-inter text-neutral-300">{setup.content.fontFamily}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-400">
            <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden="true" />
            <span>Extensions</span>
          </div>
          <span className="font-inter text-neutral-300">{extensionsCount} Installed</span>
        </div>
      </CardContent>

      <Separator className="w-full border-t border-dashed border-neutral-800/50 bg-transparent" />

      <CardFooter className="flex flex-col space-y-2">
        <div className="flex w-full items-center justify-between gap-2">
          <StarButton
            setupId={setup.id}
            initialIsStarred={setup.starData?.isStarred ?? false}
            initialStarCount={setup.starData?.starCount ?? 0}
            size="md"
            showCount={true}
          />
          <SetupDeleteDialog setupId={setup.id} />
        </div>
      </CardFooter>
    </Card>
  );
};

DashboardSetupCard.displayName = 'DashboardSetupCard';

export { DashboardSetupCard };
