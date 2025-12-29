'use client';

import { IconDownload } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const ExtensionResourcesDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="font-oxanium flex h-10 cursor-pointer items-center gap-2 rounded bg-white px-6 text-base font-medium text-neutral-950 shadow-lg shadow-white/5 transition-all hover:scale-105 hover:bg-neutral-200"
        >
          <IconDownload className="size-4" aria-hidden="true" />
          Install Extension
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Extension Resources</DialogTitle>
        </DialogHeader>
        <DialogDescription>Here are some resources to help you get started with the extension.</DialogDescription>

        <Button variant="outline" className="cursor-pointer" asChild>
          <Link target="_blank" href="https://open-vsx.org/extension/devkraken/setuphub-sync">
            <Image src="/images/ide-icons/open-vsx.svg" alt="Open VSX" width={24} height={24} />
            Open VSX
          </Link>
        </Button>

        <Button variant="outline" className="cursor-pointer" asChild>
          <Link target="_blank" href="https://marketplace.visualstudio.com/items?itemName=DevKraken.setuphub-sync">
            <Image src="/images/ide-icons/vscode.svg" alt="Visual Studio Code" width={24} height={24} />
            Visual Studio Code
          </Link>
        </Button>
      </DialogContent>
    </Dialog>
  );
};

ExtensionResourcesDialog.displayName = 'ExtensionResourcesDialog';
export { ExtensionResourcesDialog };
