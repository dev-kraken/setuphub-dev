import { IconBrush, IconTextSize, IconTypography } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { Blocks, CircleCheck, Palette, Sliders } from 'lucide-react';
import Link from 'next/link';

import StarButton from '@/components/shared/star-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getIdeMeta } from '@/lib/config/ide-registry';
import { type SetupWithUser } from '@/types/setup';

type SetupSidebarProps = {
  setup: SetupWithUser;
};

/**
 * Sidebar for setup detail page showing user info and setup metadata.
 */
export const SetupSidebar = ({ setup }: SetupSidebarProps) => {
  const user = setup.user;
  const ideMeta = getIdeMeta(setup.setups.editorName);

  return (
    <div className="flex flex-col space-y-3 rounded-xl border border-neutral-800 p-5 lg:col-span-3">
      <div className="flex w-full items-center justify-between text-center">
        <div className="relative size-18 rounded-full bg-linear-to-tr from-purple-500 to-indigo-500 p-0.5 shadow-xl">
          <Avatar className="size-full rounded-full border border-neutral-700">
            <AvatarImage src={user.image || ''} alt={`${user.name}'s avatar`} title={`${user.name}'s avatar`} />
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="font-oxanium text-lg font-medium tracking-tight text-white">{user.name}</div>
          <Link href={`/${user.username}`}>
            <span className="font-inter text-xs text-neutral-500 hover:text-yellow-400">@{user.username}</span>
          </Link>
        </div>
      </div>
      <Separator className="w-full border-t border-dashed border-neutral-800/50 bg-transparent" />
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex size-12 items-center justify-center rounded-md border border-indigo-500/20 bg-indigo-500/10 p-1.5 text-indigo-400">
              <Avatar className="size-full rounded-none">
                <AvatarImage
                  src={ideMeta?.icon || ''}
                  alt={`${setup.setups.editorName} logo`}
                  title={`${setup.setups.editorName} logo`}
                />
                <AvatarFallback>{ideMeta?.label?.charAt(0) || setup.setups.editorName.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col items-start gap-1">
              <h1 className="font-oxanium text-base font-medium text-white">{setup.setups.name}</h1>
              <Badge variant="outline" className="text-[10px]">
                {ideMeta?.label}
              </Badge>
            </div>
          </div>
          <StarButton
            setupId={setup.setups.id}
            initialIsStarred={setup.starData?.isStarred}
            initialStarCount={setup.starData?.starCount}
            size="md"
            showCount={true}
          />
        </div>
        <Separator className="w-full border-t border-dashed border-neutral-800/50 bg-transparent" />
        <div className="flex items-center justify-between">
          <h2 className="font-oxanium flex items-center gap-2 text-sm font-medium text-white">
            <Palette className="h-4 w-4 text-neutral-500" /> Appearance
          </h2>
          <span className="rounded border border-neutral-800 bg-neutral-900 px-2 py-0.5 font-mono text-[10px] text-neutral-500">
            workbench.colorTheme
          </span>
        </div>
        <div className="group relative flex flex-col gap-2 rounded-lg border border-neutral-700 bg-neutral-900/40 p-3 transition-all hover:bg-neutral-900/60">
          <div className="absolute top-0 right-0 p-3 opacity-10 transition-opacity group-hover:opacity-20">
            <IconBrush className="size-8 text-white" />
          </div>
          <Badge variant="progress" className="text-[10px]">
            Current Theme
          </Badge>
          <h3 className="font-oxanium text-base font-medium text-white">{setup.setups.content.theme}</h3>
        </div>
        <div className="group relative flex flex-col gap-2 rounded-lg border border-neutral-700 bg-neutral-900/40 p-3 transition-all hover:bg-neutral-900/60">
          <div className="absolute top-0 right-0 p-3 opacity-10 transition-opacity group-hover:opacity-20">
            <IconTypography className="size-8 text-white" />
          </div>
          <Badge variant="warning" className="text-[10px]">
            Current Font
          </Badge>
          <h3 className="font-oxanium text-base font-medium text-white">{setup.setups.content.fontFamily}</h3>
        </div>
        <div className="group relative flex flex-col gap-2 rounded-lg border border-neutral-700 bg-neutral-900/40 p-3 transition-all hover:bg-neutral-900/60">
          <div className="absolute top-0 right-0 p-3 opacity-10 transition-opacity group-hover:opacity-20">
            <IconTextSize className="size-8 text-white" />
          </div>
          <Badge variant="warning" className="text-[10px]">
            Current Font Size
          </Badge>
          <h3 className="font-oxanium text-base font-medium text-white">{setup.setups.content.fontSize}</h3>
        </div>
      </div>
      <Separator className="w-full border-t border-dashed border-neutral-800/50 bg-transparent" />
      <TabsList className="h-fit w-full flex-col justify-start gap-2 bg-transparent text-start">
        <TabsTrigger
          value="settings"
          className="font-oxanium flex w-full items-center justify-start gap-2 px-3 py-2 text-sm"
        >
          <Sliders className="h-3.5 w-3.5 text-blue-400" />
          Settings
        </TabsTrigger>
        <TabsTrigger
          value="extensions"
          className="font-oxanium flex w-full items-center justify-start gap-2 px-3 py-2 text-sm"
        >
          <Blocks className="h-3.5 w-3.5" />
          Extensions <span className="ml-auto text-blue-400">{setup.setups.content.extensions?.length ?? 0}</span>
        </TabsTrigger>
      </TabsList>
      <div className="mt-auto border-t border-neutral-800 pt-6">
        <div className="rounded border border-neutral-800 bg-neutral-900 p-3">
          <div className="mb-2 text-[10px] font-medium text-neutral-500 uppercase">Last synced</div>
          <div className="flex items-center gap-2 text-xs text-green-400">
            <CircleCheck className="h-3 w-3" />{' '}
            {formatDistanceToNow(new Date(setup.setups.updatedAt), { addSuffix: true })}
          </div>
        </div>
      </div>
    </div>
  );
};
