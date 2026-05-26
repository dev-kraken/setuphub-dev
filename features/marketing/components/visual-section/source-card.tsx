import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

SyntaxHighlighter.registerLanguage('json', json);

const SourceCard = () => {
  return (
    <div className="glass-panel relative z-10 col-span-2 overflow-hidden rounded-xl bg-[#0F0F0F] shadow-2xl ring-1 ring-white/10">
      <div className="flex h-9 items-center justify-between border-b border-white/5 bg-black/40 px-4">
        <div className="flex gap-1.5">
          <div className="size-2.5 rounded-full bg-[#FF5F56] opacity-80"></div>
          <div className="size-2.5 rounded-full bg-[#FFBD2E] opacity-80"></div>
          <div className="size-2.5 rounded-full bg-[#27C93F] opacity-80"></div>
        </div>
        <span className="text-[10px] font-medium text-neutral-500">app.tsx — Dev Kraken</span>
        <div className="w-10"></div>
      </div>
      <SyntaxHighlighter
        language="json"
        style={tomorrow}
        wrapLongLines={true}
        customStyle={{
          background: 'transparent',
          border: 'none',
        }}
      >
        {JSON.stringify(
          {
            theme: '**********',
            fontFamily: '**********',
            fontSize: 14,
            extensions: [{ id: 'vscode.extensions.setuphub', name: 'SetupHub', version: '1.0.0' }],
          },
          null,
          2,
        )}
      </SyntaxHighlighter>
      <div className="absolute right-4 bottom-4 flex items-center gap-2 rounded-full border border-white/10 bg-[#1A1A1A] px-3 py-1.5 shadow-xl">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
        </span>
        <span className="text-[10px] font-medium text-white">Syncing...</span>
      </div>
    </div>
  );
};

SourceCard.displayName = 'SourceCard';
export { SourceCard };
