import { IconSettingsHeart } from '@tabler/icons-react';

import { EmptySetupCard } from '@/features/dashboard/components/empty-setup-card';

import { type GetUserSetupsResponse } from '../types';
import { DashboardSetupCard } from './dashboard-setup-card';

interface UserSetupsProps {
  userSetups: GetUserSetupsResponse;
}

/**
 * Component displaying a list of user's synced setups.
 */
const UserSetups = ({ userSetups }: UserSetupsProps) => {
  const userSetupsData = userSetups.data ?? [];

  if (!userSetups.success) {
    return <div>Error: {userSetups.error}</div>;
  }

  if (userSetupsData.length === 0) {
    return <EmptySetupCard />;
  }

  return (
    <div className="glass-card hover:glass-card-hover group relative space-y-5 rounded-lg border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-sm">
      <div className="absolute top-0 right-0 p-3 opacity-10 transition-opacity group-hover:opacity-20">
        <IconSettingsHeart className="h-12 w-12 text-white" />
      </div>
      <div>
        <h2 className="font-oxanium text-xl font-semibold text-white">User Setups</h2>
        <p className="font-inter text-base leading-relaxed font-light text-neutral-400">
          Manage your synced editor configurations.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {userSetupsData.map((setup) => (
          <DashboardSetupCard key={setup.id} setup={setup} />
        ))}
      </div>
    </div>
  );
};

UserSetups.displayName = 'UserSetups';
export { UserSetups };
