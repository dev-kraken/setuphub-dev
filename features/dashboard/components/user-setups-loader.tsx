import { getUserSetups } from '../actions/get-user-setups';
import { UserSetups } from './user-setups';

/**
 * Async server component that fetches user setups and renders UserSetups.
 * Used with Suspense for streaming.
 */
const UserSetupsLoader = async () => {
  const userSetupsResponse = await getUserSetups();
  return <UserSetups userSetups={userSetupsResponse} />;
};

UserSetupsLoader.displayName = 'UserSetupsLoader';
export { UserSetupsLoader };
