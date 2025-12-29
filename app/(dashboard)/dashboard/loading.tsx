import {
  ExtensionTokenCardSkeleton,
  UserProfileCardSkeleton,
  UserSetupsSkeleton,
} from '@/features/dashboard/components/skeletons';

export default function DashboardLoading() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-5">
      <div>
        <div className="font-oxanium text-3xl font-semibold">Dashboard</div>
        <p className="text-gray-500">Manage your access tokens and sync preferences directly from here.</p>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <UserProfileCardSkeleton />
        <ExtensionTokenCardSkeleton />
      </div>
      <UserSetupsSkeleton />
    </section>
  );
}
