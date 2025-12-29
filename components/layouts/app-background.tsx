import { type ReactNode } from 'react';

export function AppBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-black">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(226, 232, 240, 0.15), transparent 70%), #000000',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
