'use client';

import { Copy, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

import { createToken, updateToken } from '../../actions/token';

interface GenerateTokenProps {
  tokenId?: string;
}

const GenerateToken = ({ tokenId }: GenerateTokenProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [isTokenVisible, setIsTokenVisible] = useState(false);
  const [isNewToken, setIsNewToken] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleGenerateToken = async () => {
    startTransition(async () => {
      try {
        const isCreating = !tokenId;
        let response;
        if (isCreating) {
          response = await createToken();
        } else {
          response = await updateToken(tokenId);
        }
        if (response.success && response.plainToken) {
          setNewToken(response.plainToken);
          setShowTokenDialog(true);
          setIsTokenVisible(true);
          setIsNewToken(isCreating);
          toast.success('Token generated successfully');
        }

        if (response.error) {
          toast.error(response.error);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate token';
        toast.error(errorMessage);
      }
    });
  };

  const handleCopyToken = () => {
    if (newToken) {
      navigator.clipboard.writeText(newToken);
      toast.success('Token copied to clipboard');
    }
  };

  const handleCloseDialog = () => {
    setShowTokenDialog(false);
    setNewToken(null);
    setIsTokenVisible(false);
    // Refresh the page after dialog closes for first-time token creation
    // This updates the UI to show the TokenDisplay component
    if (isNewToken) {
      setIsNewToken(false);
      setIsRefreshing(true);
      router.refresh();
    }
  };

  // Show skeleton while refreshing after first-time token creation
  if (isRefreshing) {
    return (
      <div className="animate-in fade-in space-y-3 duration-200">
        {/* Token Active status skeleton */}
        <div className="flex items-center gap-2 rounded border border-green-500/20 bg-green-500/10 p-3">
          <Skeleton className="h-5 w-5 rounded bg-green-500/30" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-20 bg-green-500/30" />
            <Skeleton className="h-2.5 w-28 bg-neutral-700/50" />
          </div>
        </div>
        {/* Security note skeleton */}
        <Skeleton className="h-2.5 w-full bg-neutral-700/50" />
        {/* Regenerate button skeleton */}
        <Skeleton className="mt-2 h-9 w-full rounded border border-dashed border-neutral-700 bg-neutral-800/50" />
      </div>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        className="mt-2 w-full rounded border border-dashed border-neutral-700 py-2 text-xs text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
        onClick={handleGenerateToken}
        disabled={isPending}
      >
        {isPending ? 'Generating...' : tokenId ? 'Regenerate Token' : 'Generate Token'}
      </Button>

      <Dialog open={showTokenDialog} onOpenChange={handleCloseDialog}>
        <DialogContent
          className="sm:max-w-lg"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="font-oxanium text-xl font-semibold text-white">Your New Access Token</DialogTitle>
            <DialogDescription className="text-neutral-400">
              Copy this token now. For security reasons, you won&apos;t be able to see it again.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex w-full items-center gap-2">
              <div className="flex min-w-0 flex-1 items-center justify-between overflow-hidden rounded border border-neutral-800 bg-neutral-950 p-1.5">
                <span className="max-w-96 min-w-0 truncate px-2 font-mono text-xs text-neutral-300">
                  {isTokenVisible ? newToken : '•'.repeat(40)}
                </span>
                <Button
                  onClick={() => setIsTokenVisible(!isTokenVisible)}
                  variant="ghost"
                  size="icon-sm"
                  className="h-fit w-fit p-1! text-neutral-600 hover:text-neutral-400"
                  type="button"
                >
                  {isTokenVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 rounded border border-neutral-700 bg-neutral-800 text-white transition-colors hover:bg-neutral-700"
                onClick={handleCopyToken}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <Badge variant="warning" className="w-full rounded-sm py-2 text-center text-xs font-medium">
              Make sure to copy your token now. You won&apos;t be able to see it again!
            </Badge>

            <Button onClick={handleCloseDialog} className="w-full">
              I&apos;ve Copied My Token
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

GenerateToken.displayName = 'GenerateToken';
export { GenerateToken };
