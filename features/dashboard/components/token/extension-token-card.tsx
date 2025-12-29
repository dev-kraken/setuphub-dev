import { Key } from 'lucide-react';

import { getUserToken } from '../../actions/token';
import { GenerateToken } from './generate-token';
import { TokenDisplay } from './token-display';

const ExtensionTokenCard = async () => {
  const tokenResponse = await getUserToken();
  const tokenData = tokenResponse.data?.[0];

  return (
    <div className="glass-card hover:glass-card-hover group relative overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-sm">
      <div className="absolute top-0 right-0 p-3 opacity-10 transition-opacity group-hover:opacity-20">
        <Key className="h-12 w-12 text-white" />
      </div>
      <h2 className="mb-4 text-sm font-medium text-white">Access Token</h2>

      {tokenData ? (
        <TokenDisplay tokenId={tokenData.id} createdAt={tokenData.createdAt} lastUsedAt={tokenData.lastUsedAt} />
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-neutral-500">No token generated yet.</p>
          <GenerateToken />
        </div>
      )}
    </div>
  );
};

ExtensionTokenCard.displayName = 'ExtensionTokenCard';
export { ExtensionTokenCard };
