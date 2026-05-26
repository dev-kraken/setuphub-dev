// Average adult silent reading speed for moderately technical prose runs
// ~200–280 wpm. We lean a bit slower (220) because dev posts include
// terminology readers pause on. Better to under-promise than over-promise.
const WORDS_PER_MINUTE = 220;

export function estimateReadingTime(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}
