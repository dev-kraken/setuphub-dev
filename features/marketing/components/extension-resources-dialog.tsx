'use client';

import { IconDownload, IconExternalLink } from '@tabler/icons-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const extensionResources = [
  {
    name: 'Open VSX',
    href: 'https://open-vsx.org/extension/devkraken/setuphub-sync',
    icon: '/images/ide-icons/open-vsx.svg',
    description: 'Open VSX Registry',
    gradient: 'from-orange-500/20 via-orange-500/10 to-transparent',
    borderColor: 'border-orange-500/20',
    hoverBorderColor: 'hover:border-orange-500/40',
    iconBg: 'bg-orange-500/10',
  },
  {
    name: 'Visual Studio Code',
    href: 'https://marketplace.visualstudio.com/items?itemName=DevKraken.setuphub-sync',
    icon: '/images/ide-icons/vscode.svg',
    description: 'VS Code Marketplace',
    gradient: 'from-blue-500/20 via-blue-500/10 to-transparent',
    borderColor: 'border-blue-500/20',
    hoverBorderColor: 'hover:border-blue-500/40',
    iconBg: 'bg-blue-500/10',
  },
  {
    name: 'JetBrains',
    href: 'https://plugins.jetbrains.com/plugin/29951-setuphub-sync',
    icon: '/images/ide-icons/jetbrains.svg',
    description: 'JetBrains Plugin Repository',
    gradient: 'from-purple-500/20 via-purple-500/10 to-transparent',
    borderColor: 'border-purple-500/20',
    hoverBorderColor: 'hover:border-purple-500/40',
    iconBg: 'bg-purple-500/10',
  },
];

const ExtensionResourcesDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="font-oxanium group relative flex h-10 cursor-pointer items-center gap-2 overflow-hidden rounded-lg bg-white px-6 text-base font-medium text-neutral-950 shadow-lg shadow-white/5 transition-all hover:scale-105 hover:bg-neutral-200"
        >
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
          <IconDownload
            className="relative z-10 size-4 transition-transform group-hover:scale-110"
            aria-hidden="true"
          />
          <span className="relative z-10">Install Extension</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl border-neutral-800 bg-[#0A0A0A] p-0 shadow-2xl ring-1 ring-white/10">
        <div className="relative overflow-hidden rounded-lg">
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-linear-to-br from-neutral-900 via-[#0A0A0A] to-neutral-900" />
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative p-8">
            <DialogHeader className="mb-8 text-left">
              <DialogTitle className="font-oxanium text-2xl font-semibold tracking-tight text-white">
                Choose Your IDE
              </DialogTitle>
              <DialogDescription className="font-inter mt-2 text-base leading-relaxed text-neutral-400">
                Install the SetupHub extension from your preferred marketplace and start syncing your development setup.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 sm:grid-cols-1">
              {extensionResources.map((resource, index) => (
                <motion.div
                  key={resource.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <a href={resource.href} target="_blank" rel="noopener noreferrer" className="group relative block">
                    <motion.div
                      className={`relative overflow-hidden rounded-xl border ${resource.borderColor} ${resource.hoverBorderColor} bg-[#0F0F0F]/80 backdrop-blur-sm transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-black/50`}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Gradient overlay */}
                      <div
                        className={`absolute inset-0 bg-linear-to-br ${resource.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                      />

                      <div className="relative flex items-center gap-4 p-5">
                        {/* Icon container */}
                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border ${resource.borderColor} ${resource.iconBg} group-hover:border-opacity-60 backdrop-blur-sm transition-all duration-300 group-hover:scale-110`}
                        >
                          <Image
                            src={resource.icon}
                            alt={resource.name}
                            width={32}
                            height={32}
                            className="transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-oxanium text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-neutral-100">
                              {resource.name}
                            </h3>
                            <IconExternalLink className="size-4 text-neutral-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-neutral-300" />
                          </div>
                          <p className="font-inter mt-1 text-sm text-neutral-500 transition-colors group-hover:text-neutral-400">
                            {resource.description}
                          </p>
                        </div>

                        {/* Hover indicator */}
                        <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <div className="h-2 w-2 rounded-full bg-white/40" />
                        </div>
                      </div>
                    </motion.div>
                  </a>
                </motion.div>
              ))}
            </div>

            {/* Footer note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 rounded-lg border border-neutral-800/50 bg-neutral-900/30 p-4 backdrop-blur-sm"
            >
              <p className="font-inter text-center text-xs text-neutral-500">
                All extensions are free and open source. Choose the marketplace that works best for your workflow.
              </p>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

ExtensionResourcesDialog.displayName = 'ExtensionResourcesDialog';
export { ExtensionResourcesDialog };
