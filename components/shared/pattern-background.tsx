'use client';

import { type CSSProperties } from 'react';

/**
 * Pattern style configuration
 */
interface PatternStyle {
  backgroundImage: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundColor?: string;
  imageRendering?: CSSProperties['imageRendering'];
}

/**
 * Generates a deterministic index from a string seed
 */
const getPatternIndex = (seed: string, totalPatterns: number): number => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % totalPatterns;
};

/**
 * Collection of unique pattern styles for card backgrounds
 * CSS strings are kept on single lines to prevent hydration mismatches
 */
const PATTERNS: PatternStyle[] = [
  // Pattern 0: Green grid with dots
  {
    backgroundImage:
      'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(34, 197, 94, 0.15) 19px, rgba(34, 197, 94, 0.15) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(34, 197, 94, 0.15) 19px, rgba(34, 197, 94, 0.15) 20px), radial-gradient(circle at 20px 20px, rgba(16, 185, 129, 0.18) 2px, transparent 2px)',
    backgroundSize: '40px 40px',
  },
  // Pattern 1: Multi-angle lines (green, blue, purple)
  {
    backgroundImage:
      'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(34, 197, 94, 0.12) 20px, rgba(34, 197, 94, 0.12) 21px), repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(16, 185, 129, 0.10) 30px, rgba(16, 185, 129, 0.10) 31px), repeating-linear-gradient(60deg, transparent, transparent 40px, rgba(59, 130, 246, 0.08) 40px, rgba(59, 130, 246, 0.08) 41px), repeating-linear-gradient(150deg, transparent, transparent 35px, rgba(147, 51, 234, 0.06) 35px, rgba(147, 51, 234, 0.06) 36px)',
  },
  // Pattern 2: Subtle white grid
  {
    backgroundColor: '#000000',
    backgroundImage:
      'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px), radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
    backgroundSize: '20px 20px',
  },
  // Pattern 3: Orange diagonal crosshatch
  {
    backgroundImage:
      'repeating-linear-gradient(45deg, rgba(255, 140, 0, 0.12) 0, rgba(255, 140, 0, 0.12) 1px, transparent 1px, transparent 22px), repeating-linear-gradient(-45deg, rgba(255, 69, 0, 0.08) 0, rgba(255, 69, 0, 0.08) 1px, transparent 1px, transparent 22px)',
    backgroundSize: '44px 44px',
  },
  // Pattern 4: Neon pink and green diagonals
  {
    backgroundImage:
      'repeating-linear-gradient(45deg, rgba(0,255,128,0.09) 0, rgba(0,255,128,0.09) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(-45deg, rgba(255,0,128,0.10) 0, rgba(255,0,128,0.10) 1px, transparent 1px, transparent 30px), radial-gradient(circle at 60% 40%, rgba(0,255,128,0.05) 0, transparent 60%)',
    backgroundSize: '40px 40px, 60px 60px, 100% 100%',
    backgroundPosition: '0 0, 0 0, center',
  },
  // Pattern 5: Multi-angle warm tones
  {
    backgroundImage:
      'repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(16, 185, 129, 0.18) 2px, rgba(16, 185, 129, 0.18) 3px, transparent 3px, transparent 8px), repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(245, 101, 101, 0.10) 2px, rgba(245, 101, 101, 0.10) 3px, transparent 3px, transparent 8px), repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(234, 179, 8, 0.08) 2px, rgba(234, 179, 8, 0.08) 3px, transparent 3px, transparent 8px)',
  },
  // Pattern 6: Orange ray burst
  {
    backgroundImage:
      'repeating-linear-gradient(30deg, rgba(255, 100, 0, 0.1) 0, rgba(255, 100, 0, 0.1) 1px, transparent 1px, transparent 10px, rgba(255, 100, 0, 0.15) 11px, rgba(255, 100, 0, 0.15) 12px, transparent 12px, transparent 40px)',
  },
  // Pattern 7: Green diamond grid
  {
    backgroundImage:
      'repeating-linear-gradient(45deg, rgba(0, 255, 128, 0.1) 0, rgba(0, 255, 128, 0.1) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(-45deg, rgba(0, 255, 128, 0.1) 0, rgba(0, 255, 128, 0.1) 1px, transparent 1px, transparent 20px)',
  },
  // Pattern 8: Purple/indigo nested grid
  {
    backgroundImage:
      'repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(99, 102, 241, 0.15) 5px, rgba(99, 102, 241, 0.15) 6px, transparent 6px, transparent 15px), repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(99, 102, 241, 0.15) 5px, rgba(99, 102, 241, 0.15) 6px, transparent 6px, transparent 15px), repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(139, 92, 246, 0.12) 10px, rgba(139, 92, 246, 0.12) 11px, transparent 11px, transparent 30px), repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(139, 92, 246, 0.12) 10px, rgba(139, 92, 246, 0.12) 11px, transparent 11px, transparent 30px)',
  },
  // Pattern 9: Pink/purple radial glow grid
  {
    backgroundColor: '#020617',
    backgroundImage:
      'linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px), radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)',
    backgroundSize: '40px 40px, 40px 40px, 100% 100%',
  },
  // Pattern 10: Pixelated dots
  {
    backgroundColor: '#0a0a0a',
    backgroundImage:
      'radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 1px), radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)',
    backgroundSize: '10px 10px',
    imageRendering: 'pixelated',
  },
  // Pattern 11: Matrix green scanlines
  {
    backgroundImage:
      'repeating-linear-gradient(45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(-45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(90deg, rgba(0, 255, 65, 0.03) 0, rgba(0, 255, 65, 0.03) 1px, transparent 1px, transparent 4px)',
    backgroundSize: '24px 24px, 24px 24px, 8px 8px',
  },
  // Pattern 12: Bold gray grid
  {
    backgroundColor: '#000000',
    backgroundImage:
      'linear-gradient(to right, rgba(75, 85, 99, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(75, 85, 99, 0.4) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
  },
  // Pattern 13: Cyan fading streaks
  {
    backgroundImage:
      'repeating-linear-gradient(45deg, rgba(0, 255, 128, 0.2) 0px, rgba(0, 255, 128, 0) 2px, transparent 2px, transparent 25px)',
  },
];

interface PatternBackgroundProps {
  /** Seed string to deterministically select a pattern (e.g., setup ID) */
  seed?: string;
  /** Directly specify a pattern variant (0 to PATTERNS.length - 1) */
  variant?: number;
  /** Additional CSS classes */
  className?: string;
}

/** Total number of available patterns */
const PATTERN_COUNT = PATTERNS.length;

/**
 * PatternBackground - Renders a decorative pattern background for cards.
 * Uses deterministic pattern selection based on seed to ensure consistency.
 *
 * @param seed - Use a unique string (like setup ID) for deterministic pattern selection
 * @param variant - Directly specify a pattern index (overrides seed)
 * @param className - Additional CSS classes
 */
const PatternBackground = ({ seed, variant, className = '' }: PatternBackgroundProps) => {
  // Calculate pattern index deterministically (no hooks needed)
  let patternIndex = 0;
  if (typeof variant === 'number') {
    patternIndex = Math.abs(variant) % PATTERN_COUNT;
  } else if (seed) {
    patternIndex = getPatternIndex(seed, PATTERN_COUNT);
  }

  const pattern = PATTERNS[patternIndex];

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      style={{
        backgroundColor: pattern.backgroundColor,
        backgroundImage: pattern.backgroundImage,
        backgroundSize: pattern.backgroundSize,
        backgroundPosition: pattern.backgroundPosition,
        imageRendering: pattern.imageRendering,
      }}
      aria-hidden="true"
    />
  );
};

PatternBackground.displayName = 'PatternBackground';

export default PatternBackground;
