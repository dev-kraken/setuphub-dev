'use client';

import { formatDistanceToNow } from 'date-fns';
import { ShieldCheck } from 'lucide-react';

import { GenerateToken } from './generate-token';

interface TokenDisplayProps {
  tokenId: string;
  createdAt: Date;
  lastUsedAt?: Date | null;
}

export const TokenDisplay = ({ tokenId, createdAt, lastUsedAt }: TokenDisplayProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded border border-green-500/20 bg-green-500/10 p-3">
        <ShieldCheck className="h-5 w-5 text-green-400" />
        <div className="flex-1">
          <p className="text-xs font-medium text-green-400">Token Active</p>
          <p className="text-xs text-neutral-400">
            Created {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </p>
          {lastUsedAt && (
            <p className="text-xs text-neutral-500">
              Last used {formatDistanceToNow(new Date(lastUsedAt), { addSuffix: true })}
            </p>
          )}
        </div>
      </div>
      <p className="text-xs text-neutral-500">
        For security, your token is stored encrypted and cannot be displayed. Regenerate if you need a new one.
      </p>
      <GenerateToken tokenId={tokenId} />
    </div>
  );
};
