'use client';
import { IconLoader2, IconTrash } from '@tabler/icons-react';
import { AlertTriangleIcon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { deleteUserSetup } from '@/features/dashboard/actions/delete-user-setup';

interface SetupDeleteDialogProps {
  setupId: string;
}

const SetupDeleteDialog = ({ setupId }: SetupDeleteDialogProps) => {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await deleteUserSetup(setupId);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      setOpen(false);
    });
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          className="flex cursor-pointer items-center gap-1.5 text-xs hover:bg-red-500/20 hover:text-red-500"
        >
          <IconTrash className="size-4" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <div className="flex items-start space-x-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <AlertTriangleIcon className="h-6 w-6 text-red-600" />
          </div>
          <DialogHeader>
            <DialogTitle className="font-oxanium text-2xl font-semibold text-white">Delete setup</DialogTitle>
            <DialogDescription className="font-inter text-base leading-relaxed font-light text-neutral-400">
              Are you sure you want to delete this setup? All of your data will be permanently removed. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            className="flex cursor-pointer items-center gap-1.5 text-xs hover:bg-red-500/20 hover:text-red-500"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? <IconLoader2 className="size-4 animate-spin" /> : <IconTrash className="size-4" />}
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

SetupDeleteDialog.displayName = 'SetupDeleteDialog';
export { SetupDeleteDialog };
