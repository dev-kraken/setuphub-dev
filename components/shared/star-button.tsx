'use client';

import { IconCarambola, IconCarambolaFilled } from '@tabler/icons-react';
import { useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { toggleSetupStar } from '@/features/setups';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface StarButtonProps {
  /** The ID (UUID) of the setup to star */
  setupId: string;
  /** Whether the current user has already starred this setup */
  initialIsStarred?: boolean;
  /** The initial star count */
  initialStarCount?: number;
  /** Size variant of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the star count */
  showCount?: boolean;
  /** Additional class names */
  className?: string;
}

interface StarState {
  isStarred: boolean;
  starCount: number;
}

// ============================================================================
// Constants
// ============================================================================

const SIZE_CONFIG = {
  sm: {
    icon: 'size-4',
    text: 'text-[10px]',
    gap: 'gap-0.5',
  },
  md: {
    icon: 'size-5',
    text: 'text-xs',
    gap: 'gap-1',
  },
  lg: {
    icon: 'size-6',
    text: 'text-sm',
    gap: 'gap-1.5',
  },
} as const;

// ============================================================================
// Utils
// ============================================================================

/**
 * Formats the star count for display.
 * Converts large numbers to a compact format (e.g., 1.2k, 5.4M).
 */
function formatStarCount(count: number): string {
  if (count < 1000) return count.toString();
  if (count < 1_000_000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
}

// ============================================================================
// Component
// ============================================================================

export default function StarButton({
  setupId,
  initialIsStarred = false,
  initialStarCount = 0,
  size = 'md',
  showCount = true,
  className,
}: StarButtonProps) {
  const [isPending, startTransition] = useTransition();

  const [optimisticState, setOptimisticState] = useOptimistic<StarState, boolean>(
    { isStarred: initialIsStarred, starCount: initialStarCount },
    (currentState, newIsStarred) => ({
      isStarred: newIsStarred,
      starCount: newIsStarred ? currentState.starCount + 1 : Math.max(0, currentState.starCount - 1),
    }),
  );

  const { isStarred, starCount } = optimisticState;
  const sizeConfig = SIZE_CONFIG[size];

  const handleToggleStar = () => {
    startTransition(async () => {
      // Optimistically update the UI
      setOptimisticState(!isStarred);

      const result = await toggleSetupStar(setupId);

      if (!result.success) {
        // Revert optimistic update on error
        setOptimisticState(isStarred);
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  };

  const StarIcon = isStarred ? IconCarambolaFilled : IconCarambola;

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={isPending}
      onClick={handleToggleStar}
      aria-label={isStarred ? 'Remove star from setup' : 'Star this setup'}
      aria-pressed={isStarred}
      className={cn(
        'cursor-pointer bg-transparent! px-1.5 py-1 hover:scale-105 hover:bg-transparent!',
        'transition-all duration-200',
        'hover:bg-transparent',
        sizeConfig.gap,
        isStarred ? 'text-yellow-400 hover:text-yellow-300' : 'text-neutral-500 hover:text-yellow-400',
        isPending && 'pointer-events-none opacity-70',
        className,
      )}
    >
      <StarIcon
        className={cn(
          sizeConfig.icon,
          'transition-transform duration-200',
          isStarred && 'scale-110',
          !isPending && 'group-hover:scale-110',
        )}
      />
      {showCount && (
        <span className={cn(sizeConfig.text, 'font-medium tabular-nums', 'transition-colors duration-200')}>
          {formatStarCount(starCount)}
        </span>
      )}
    </Button>
  );
}
