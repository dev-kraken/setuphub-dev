'use client';

import { IconBrush, IconTextSize, IconTypography } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { Blocks, CircleCheck, Palette, Sliders } from 'lucide-react';
import { motion } from 'motion/react';
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
 * Refined editorial design with improved visual hierarchy.
 */
export const SetupSidebar = ({ setup }: SetupSidebarProps) => {
  const user = setup.user;
  const ideMeta = getIdeMeta(setup.setups.editorName);

  return (
    <div className="flex h-full flex-col rounded-xl border border-neutral-800/50 bg-[#0A0A0A]/50 p-6 shadow-2xl ring-1 ring-white/5 backdrop-blur-sm">
      {/* User Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-neutral-800/50 blur-md" />
            <Avatar className="relative size-16 rounded-full border-2 border-neutral-800/50 ring-2 ring-neutral-900/50">
              <AvatarImage src={user.image || ''} alt={`${user.name}'s avatar`} title={`${user.name}'s avatar`} />
              <AvatarFallback className="bg-neutral-800 text-neutral-300">{user.name?.[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-oxanium truncate text-lg font-semibold tracking-tight text-white">{user.name}</h2>
            <Link href={`/${user.username}`} className="block">
              <span className="font-inter text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-300">
                @{user.username}
              </span>
            </Link>
          </div>
        </div>
      </motion.div>

      <Separator className="mb-6 border-neutral-800/50" />

      {/* Setup Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mb-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-neutral-800/50 bg-neutral-900/50 p-2">
              <Avatar className="size-full rounded">
                <AvatarImage
                  src={ideMeta?.icon || ''}
                  alt={`${setup.setups.editorName} logo`}
                  title={`${setup.setups.editorName} logo`}
                />
                <AvatarFallback className="bg-neutral-800 text-xs text-neutral-400">
                  {ideMeta?.label?.charAt(0) || setup.setups.editorName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-oxanium truncate text-base font-semibold tracking-tight text-white">
                {setup.setups.name}
              </h1>
              <Badge variant="outline" className="mt-1 text-[10px] font-medium">
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
      </motion.div>

      <Separator className="mb-6 border-neutral-800/50" />

      {/* Appearance Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="mb-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-oxanium flex items-center gap-2 text-xs font-semibold tracking-wider text-neutral-400 uppercase">
            <Palette className="h-3.5 w-3.5" />
            Appearance
          </h3>
        </div>
        <div className="space-y-2.5">
          <div className="group relative overflow-hidden rounded-lg border border-neutral-800/50 bg-neutral-900/30 p-3.5 transition-colors hover:border-neutral-700/50 hover:bg-neutral-900/50">
            <div className="absolute top-3 right-3 opacity-5 transition-opacity group-hover:opacity-10">
              <IconBrush className="size-6 text-white" />
            </div>
            <Badge variant="progress" className="mb-2 text-[10px] font-medium">
              Theme
            </Badge>
            <p className="font-oxanium text-sm font-medium text-white">{setup.setups.content.theme}</p>
          </div>
          <div className="group relative overflow-hidden rounded-lg border border-neutral-800/50 bg-neutral-900/30 p-3.5 transition-colors hover:border-neutral-700/50 hover:bg-neutral-900/50">
            <div className="absolute top-3 right-3 opacity-5 transition-opacity group-hover:opacity-10">
              <IconTypography className="size-6 text-white" />
            </div>
            <Badge variant="warning" className="mb-2 text-[10px] font-medium">
              Font
            </Badge>
            <p className="font-oxanium text-sm font-medium text-white">{setup.setups.content.fontFamily}</p>
          </div>
          <div className="group relative overflow-hidden rounded-lg border border-neutral-800/50 bg-neutral-900/30 p-3.5 transition-colors hover:border-neutral-700/50 hover:bg-neutral-900/50">
            <div className="absolute top-3 right-3 opacity-5 transition-opacity group-hover:opacity-10">
              <IconTextSize className="size-6 text-white" />
            </div>
            <Badge variant="warning" className="mb-2 text-[10px] font-medium">
              Size
            </Badge>
            <p className="font-oxanium text-sm font-medium text-white">{setup.setups.content.fontSize}</p>
          </div>
        </div>
      </motion.div>

      <Separator className="mb-6 border-neutral-800/50" />

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="mb-6"
      >
        <TabsList className="h-fit w-full flex-col gap-1.5 bg-transparent p-0">
          <TabsTrigger
            value="settings"
            className="font-oxanium w-full justify-start gap-2.5 rounded-lg border border-transparent px-3.5 py-2.5 text-sm font-medium transition-all data-[state=active]:border-neutral-800/50 data-[state=active]:bg-neutral-900/50"
          >
            <Sliders className="h-3.5 w-3.5 shrink-0" />
            <span>Settings</span>
          </TabsTrigger>
          <TabsTrigger
            value="extensions"
            className="font-oxanium w-full justify-start gap-2.5 rounded-lg border border-transparent px-3.5 py-2.5 text-sm font-medium transition-all data-[state=active]:border-neutral-800/50 data-[state=active]:bg-neutral-900/50"
          >
            <Blocks className="h-3.5 w-3.5 shrink-0" />
            <span>Extensions</span>
            <span className="ml-auto rounded-full bg-neutral-800/50 px-1.5 py-0.5 text-[10px] font-medium text-neutral-400">
              {setup.setups.content.extensions?.length ?? 0}
            </span>
          </TabsTrigger>
        </TabsList>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="mt-auto"
      >
        <div className="rounded-lg border border-neutral-800/50 bg-neutral-900/30 p-3.5">
          <div className="font-inter mb-1.5 text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">
            Last synced
          </div>
          <div className="font-inter flex items-center gap-2 text-xs font-medium text-green-400/90">
            <CircleCheck className="h-3 w-3 shrink-0" />
            <span>{formatDistanceToNow(new Date(setup.setups.updatedAt), { addSuffix: true })}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
