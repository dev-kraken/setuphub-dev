import { PublicSetupCardSkeleton } from '@/components/shared/skeletons';
import { Separator } from '@/components/ui/separator';
import { UserInfoSkeleton } from '@/features/user-profile/components/skeletons';

export default function UserProfileLoading() {
  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <UserInfoSkeleton />
      <Separator className="w-full border-t border-dashed border-neutral-800/50 bg-transparent" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PublicSetupCardSkeleton />
        <PublicSetupCardSkeleton />
        <PublicSetupCardSkeleton />
      </div>
    </section>
  );
}
