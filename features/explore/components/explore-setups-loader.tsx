import { getExploreSetups } from '../actions/get-explore-setups';
import { ExploreSetupsGrid } from './explore-setups-grid';

/**
 * ExploreSetupsLoader - Server component that fetches initial data and renders the grid.
 * Meant to be wrapped in a Suspense boundary for streaming.
 */
const ExploreSetupsLoader = async () => {
  const initialData = await getExploreSetups();

  return <ExploreSetupsGrid initialData={initialData} />;
};

ExploreSetupsLoader.displayName = 'ExploreSetupsLoader';

export { ExploreSetupsLoader };
