import { useEffect, useRef } from "react";

/**
 * Detects when a sentinel DOM element enters the viewport and fires a callback.
 * Uses IntersectionObserver — not scroll event listeners.
 * Includes a debounce interval to prevent rapid-fire callbacks (Jikan rate limit safety).
 *
 * @param {React.RefObject} sentinelRef  - Ref attached to a sentinel <div> at the bottom of the list.
 * @param {Function}        callback     - Called each time the sentinel becomes visible.
 * @param {boolean}         enabled      - Set to false to stop observing (e.g. when hasMore is false).
 * @param {string}          rootMargin   - IntersectionObserver rootMargin (default "400px" for pre-fetch).
 * @param {number}          minInterval  - Minimum ms between consecutive callback invocations (default 500).
 */
export function useInfiniteScroll(sentinelRef, callback, enabled = true, rootMargin = "400px", minInterval = 500) {
  const callbackRef = useRef(callback);
  const lastFiredRef = useRef(0);

  // Keep callback ref fresh without triggering the observer effect
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const now = Date.now();
          if (now - lastFiredRef.current < minInterval) return;
          lastFiredRef.current = now;
          callbackRef.current();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [sentinelRef, enabled, rootMargin, minInterval]);
}
