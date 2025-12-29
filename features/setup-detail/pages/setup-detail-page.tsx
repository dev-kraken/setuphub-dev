import { notFound } from 'next/navigation';

import { getSetupById } from '../actions/get-setup-by-id';
import { SetupLayout } from '../components/setup-layout';

type SetupDetailPageProps = {
  username: string;
  setupId: string;
};

/**
 * Setup detail page component.
 * Fetches setup data and renders the layout.
 * Validates that the setup belongs to the specified username.
 */
export const SetupDetailPage = async ({ username, setupId }: SetupDetailPageProps) => {
  const setup = await getSetupById(setupId);

  // Return 404 if setup doesn't exist or doesn't belong to the username in the URL
  if (!setup || setup.user.username !== username) {
    notFound();
  }

  return <SetupLayout setup={setup} />;
};
