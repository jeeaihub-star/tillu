// iOS & Mobile Tactile Haptic Feedback
export const triggerHaptic = (pattern: number | number[] = 12) => {
  try {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Haptics not supported or blocked
  }
};
