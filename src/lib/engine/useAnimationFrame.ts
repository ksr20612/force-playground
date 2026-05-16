import { useEffect, useRef } from 'react';

export interface AnimationFrameInfo {
  /** Delta time in seconds (already clamped to avoid huge jumps after tab switches). */
  dt: number;
  /** Wall-clock time (ms) of this frame, from `performance.now()`. */
  now: number;
}

/**
 * Drives a `requestAnimationFrame` loop. The callback receives a clamped
 * `dt` so a tab switch or breakpoint doesn't produce a multi-second leap.
 *
 * The callback is held in a ref so changing it does NOT restart the loop —
 * great for using fresh closures without retiggering the whole engine.
 */
export function useAnimationFrame(
  callback: (info: AnimationFrameInfo) => void,
  enabled = true,
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;

    let rafId = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const rawDt = (now - last) / 1000;
      last = now;
      // Clamp to 1/30s — prevents huge jumps after the tab regains focus.
      const dt = Math.min(rawDt, 1 / 30);
      callbackRef.current({ dt, now });
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [enabled]);
}
